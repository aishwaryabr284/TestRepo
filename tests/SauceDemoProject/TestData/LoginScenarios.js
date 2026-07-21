import { UserDetails } from './DemoPageDetails';

exports.validLoginScenarios = [
    { userName: UserDetails.UserNames.standard_user },
    { userName: UserDetails.UserNames.problem_user },
    {userName: UserDetails.UserNames.error_user}
];

exports.loginFailureScenarios = [
    {
        name: 'locked out user',
        userName: UserDetails.UserNames.locked_out_user,
        password: UserDetails.password,
        expectedMessage: 'Sorry, this user has been locked out.'
    },
    {
        name: 'invalid password',
        userName: UserDetails.UserNames.standard_user,
        password: UserDetails.invalidPassword,
        expectedMessage: 'Username and password do not match any user in this service'
    }
];