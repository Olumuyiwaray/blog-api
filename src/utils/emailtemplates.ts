export const registerEmailBody: string = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Verify Account</title>
</head><body style='background-color: #222533; padding: 20px; font-size: 14px; line-height: 1.43; font-family: "Helvetica Neue", "Segoe UI", Helvetica, Arial, sans-serif;'>
<div style='max-width: 600px; margin: 0px auto; background-color: #fff; box-shadow: 0px 20px 50px rgba(0,0,0,0.05);'>
    <div style='padding: 60px 70px;'>

        <div style="text-align: left;">
            <div style="padding-bottom: 20px;"><img src="{{logourl}}" alt="CardGit" style="width: 56px;"></div>
          </div>

        <h2 style='margin-top: 0px;'>New User Account</h2>
        <div style='color: #636363; font-size: 14px;'>
            Hi {{name}}, 
            <br><br> Welcome on board!
            <br><br> Please see your account activation details below:
            <!-- <br><br> Confirmation Code: <strong>{{code}}</strong> -->
            <!-- <br> Password: {{$data['password'] ?? "password"}}   -->
            <br><br>  Use the link below to confirm your account before you can login!
        </div>
        <br>
        <div style='color: #636363; font-size: 14px;'>
            This confirmation code will expire by <strong>{{expirydatetime}}</strong>
        </div>  

        <a rel="noopener" target="_blank" href='{{verificationurl}}' style='padding: 5px 15px; background-color: #4057F1; color: #fff; font-weight: bolder; font-size: 14px; display: inline-block; margin: 20px 0px; margin-right: 20px; text-decoration: none;'>
            Verify
        </a>
        
        <h4 style='margin-bottom: 10px;'>Need Help?</h4>
        <div style='color: #A5A5A5; font-size: 12px;'>
            <p>If you have any questions you can simply reply to this email or find our contact information below. Also, contact us at 
                <a href='mailto:{{contactemail}}' style='text-decoration: underline; color: #4B72FA;'>{{contactemail}}</a>
            </p>
        </div>
    </div>
        
</div>
</body></html>`;

export const forgotPasswordEmailBody: string = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Verify Account</title>
</head><body style='background-color: #222533; padding: 20px; font-family: "Helvetica Neue", "Segoe UI", Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.43;'>
<div style='max-width: 600px; margin: 0px auto; background-color: #fff; box-shadow: 0px 20px 50px rgba(0,0,0,0.05);'>
    <div style='padding: 60px 70px;'>

        <div style="text-align: left;">
            <div style="padding-bottom: 20px;"><img src="{{logourl}}" alt="CardGit" style="width: 56px;"></div>
          </div>

        <h2 style='margin-top: 0px;'>Forgot Password</h2>
        <div style='color: #636363; font-size: 14px;'>
            Hi {{name}}, <br><br> Top of the day to you.<br> <br> Please use the code below to reset your account password before you can login.
            <br><br> Reset Code: <strong>{{code}}</strong>
        </div>  

        <br>
        <div style='color: #636363; font-size: 14px;'>
            This password reset code will expire by <strong>{{expirydatetime}}</strong>
        </div>  

        <a rel="noopener" target="_blank" href='{{loginurl}}' style='padding: 5px 15px; background-color: #4057F1; color: #fff; font-weight: bolder; font-size: 14px; display: inline-block; margin: 20px 0px; margin-right: 20px; text-decoration: none;'>
            Login
        </a>
        
        <h4 style='margin-bottom: 10px;'>Need Help?</h4>
        <div style='color: #A5A5A5; font-size: 12px;'>
            <p>If you have any questions you can simply reply to this email or find our contact information below. Also, contact us at 
                <a href='mailto:{{contactemail}}' style='text-decoration: underline; color: #4B72FA;'>{{contactemail}}</a>
            </p>
        </div>
    </div>
        
</div>
</body>`;
