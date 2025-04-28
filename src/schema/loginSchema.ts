export const usernameRules = {
    required: 'メールアドレスは必須です',
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      message: 'メールアドレスの形式が正しくありません',
    },
  };

export const passwordRules = {
    required: 'パスワードは必須です',
    minLength: {
      value: 8,
      message: 'パスワードは8文字以上でなければなりません',
    },
    pattern: {
      value: /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, 
      message: 'パスワードは少なくとも1つの数字と1つの特殊文字を含める必要があります',
    },
  };

  export const otpRules = {
    required: 'OTPは必須です',
    pattern: {
        value: /^\d{6}$/,
        message: 'OTPは6桁の数字である必要があります',
    },
  };

  export const confirmPasswordRules = (password: string) => ({
    required: '確認用パスワードは必須です',
    validate: (value: string) => value === password || 'パスワードが一致しません',
  });