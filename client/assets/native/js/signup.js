/**
 * @file Provides Signup functionality.
 */

// Declare JQuery global
/* global $ */

$(document).ready(function(){

    let companyId;
    let buttonClicked;

    // Listener for Initial Sign up of an Employee
    $('#submit-btn').on('click', function(){
        buttonClicked = 'employee';
    });

    // Listener for creating a company
    $('#submit-company-btn').on('click',function(){
        buttonClicked = 'company';
    });

    $('#company-reg-form').on('submit', function() {
        let companyData = grabCompanyData();
        ajaxPost('/api/companies',companyData);
        return false;
    });

    $('#employee-reg-form').on('submit', function() {
        let employeeData = grabEmployeeData();
        ajaxPost('/api/employees',employeeData);
        return false;
    });

    $('#form-password, #form-repeat-password').on('keyup', function () {
        let repeatpassword = $('#form-repeat-password')[0];
        if ($('#form-password').val() !== $('#form-repeat-password').val()) {
            repeatpassword.setCustomValidity('Passwords do not match!');
        } else {
            repeatpassword.setCustomValidity('');
        }
    });

    /**
     * @function grabCompanyData
     * @desc Grab company data from the forms.
     * @return {company} company
     */
    function grabCompanyData(){
        let company = {};
        company.name = $('#form-company-name').val();
        company.email = $('#form-email').val();
        company.phone_number = $('#form-phone').val();
        return company;
    }

    /**
     * @function grabEmployeeData
     * @desc Grab employee data from the forms.
     * @return {employee} employee
     */
    function grabEmployeeData(){
        let employee = {};
        employee.first_name = $('#form-employee-first').val();
        employee.last_name = $('#form-employee-last').val();
        employee.email = $('#form-employee-email').val();
        employee.password = $('#form-password').val();
        employee.phone_number = $('#form-employee-phone').val();
        employee.role = 'c_admin';
        employee.company_id = companyId;
        return employee;
    }

    /**
     * @function ajaxPut
     * @param {url} url
     * @param {data} data
     * @desc Ajax function to create a POST request to server.
     */
    function ajaxPost(url, data){
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: 'json',
            success: function(response){
                if(url === '/api/employees') {
                    localStorage.setItem('userState', 1);
                    localStorage.setItem('currentUser', JSON.stringify(response));
                    location.href = '/visitors.html';
                }
                else if (url === '/api/companies') {
                    localStorage.setItem('currentCompany', JSON.stringify(response));
                    companyId = response._id;
                    transitionToNextStep();
                }
            },
            error: function(){
                handleError(url);
                return false; // This will prevent the page from refreshing
            }
        });
    }

    /**
     * @function transitionToNextStep
     * @desc Brings up the employees form after the company form is filled
     */
    function transitionToNextStep () {
        $('#company-reg-form').fadeOut(400, function() {
            $('#employee-reg-form').find('fieldset:first-child').fadeIn();
        });
    }

    /**
     * @func handleError
     * @desc Handles errors during account creation.
     */
    function handleError(url) {
        let msg = 'Sorry, and error occurred. Please try again.';
        if        (url === '/api/employees') {
            msg = 'Sorry, that email is already associated with another account. Please use a different email.';
        } else if (url === '/api/companies') {
            msg = 'Sorry, that email is already associated with another company. Please use a different email.';
        }
        $('#errorlog').html(msg);
    }
});
