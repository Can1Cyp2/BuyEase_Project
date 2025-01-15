import React, { useState } from 'react';
import '../design/pages/AccountVerificationPage.css';

const AccountVerificationPage = () => {
  const [account, setAccount] = useState({
    username: "TestUserName",
    isVerified: false,
    institution: "N/A",
  });

  const handleVerifyAccount = () => {
    setAccount({
      ...account,
      isVerified: true,
      institution: "York University",
    });
  };

  return (
    <div className="account-verification-page">
      <h1 className="account-title">Account Verification</h1>
      <div className="account-info">
        <p><strong>Username:</strong> {account.username}</p>
        <p><strong>Verification Status:</strong> {account.isVerified ? "Verified 🎉" : "Not Verified ❌"}</p>
        <p><strong>Institution:</strong> {account.institution}</p>
      </div>

      <div className="verification-steps">
        <h2>Verification Steps</h2>
        <ol>
          <li>Use your institution email to send an email to <strong>BuyEaseProject@gmail.com</strong>.</li>
          <li>Attach a clear photo of your student ID.</li>
          <li>Wait for our team to review and verify your account.</li>
        </ol>
      </div>

      <button className="test-verify-button" onClick={handleVerifyAccount}>
        Test Verify
      </button>
    </div>
  );
};

export default AccountVerificationPage;
