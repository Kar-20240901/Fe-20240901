/**
 * 校验
 */
function Validator(
  rule: any,
  fieldValue: string,
  iValidateHandle: IValidateHandle,
  callback?: any
) {
  if (!fieldValue) {
    if (callback) {
      callback(new Error(iValidateHandle.emptyErrorMsg));
    } else {
      return Promise.reject(new Error(iValidateHandle.emptyErrorMsg));
    }
  }

  if (!iValidateHandle.validate(fieldValue)) {
    if (callback) {
      callback(new Error(iValidateHandle.errorMsg));
    } else {
      return Promise.reject(new Error(iValidateHandle.errorMsg));
    }
  }

  if (callback) {
    callback();
  } else {
    return Promise.resolve();
  }
}

/**
 * 校验：可以为空
 */
function CanNullValidator(
  rule: any,
  fieldValue: string,
  iValidateHandle: IValidateHandle,
  callback?: any
) {
  if (!fieldValue) {
    if (callback) {
      callback();
    } else {
      return Promise.resolve();
    }
  }

  if (!iValidateHandle.validate(fieldValue)) {
    if (callback) {
      callback(new Error(iValidateHandle.errorMsg));
    } else {
      return Promise.reject(new Error(iValidateHandle.errorMsg));
    }
  }

  if (callback) {
    callback();
  } else {
    return Promise.resolve();
  }
}

interface IValidateHandle {
  regex: RegExp;
  maxLength: number;
  emptyErrorMsg: string;
  errorMsg: string;
  validate: (value: string) => boolean;
  validator: (rule: any, fieldValue: string, callback?: any) => Promise<void>;
  canNullValidator: (
    rule: any,
    fieldValue: string,
    callback?: any
  ) => Promise<void>;
}

export interface IValidate {
  integer: IValidateHandle;
  email: IValidateHandle;
  password: IValidateHandle;
  code: IValidateHandle;
  nickname: IValidateHandle;
  phone: IValidateHandle;
  username: IValidateHandle;
  url: IValidateHandle;
  bankDebitCard: IValidateHandle;
}

export const Validate: IValidate = {
  integer: {
    regex: /^-?\d+$/,
    maxLength: 300,
    emptyErrorMsg: "请输入数字",
    errorMsg: "请输入数字",
    validate(value: string) {
      return this.regex.test(value);
    },
    validator: (rule: any, fieldValue: string, callback?: any) => {
      return Validator(rule, fieldValue, Validate.integer, callback);
    },
    canNullValidator: (rule: any, fieldValue: string, callback?: any) => {
      return CanNullValidator(rule, fieldValue, Validate.integer, callback);
    }
  },

  email: {
    regex: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    maxLength: 100,
    emptyErrorMsg: "请输入邮箱",
    errorMsg: "邮箱格式错误",
    validate(value: string) {
      return this.regex.test(value);
    },
    validator: (rule: any, fieldValue: string, callback?: any) => {
      return Validator(rule, fieldValue, Validate.email, callback);
    },
    canNullValidator: (rule: any, fieldValue: string, callback?: any) => {
      return CanNullValidator(rule, fieldValue, Validate.email, callback);
    }
  },

  password: {
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/,
    maxLength: 20,
    emptyErrorMsg: "请输入密码",
    errorMsg:
      "密码格式错误：必须包含大小写字母和数字，可以使用特殊字符，长度8-20",
    validate(value: string) {
      return this.regex.test(value);
    },
    validator: (rule: any, fieldValue: string, callback?: any) => {
      return Validator(rule, fieldValue, Validate.password, callback);
    },
    canNullValidator: (rule: any, fieldValue: string, callback?: any) => {
      return CanNullValidator(rule, fieldValue, Validate.password, callback);
    }
  },

  code: {
    regex: /^[0-9]{6}$/,
    maxLength: 6,
    emptyErrorMsg: "请输入验证码",
    errorMsg: "验证码格式错误",
    validate(value: string) {
      return this.regex.test(value);
    },
    validator: (rule: any, fieldValue: string, callback?: any) => {
      return Validator(rule, fieldValue, Validate.code, callback);
    },
    canNullValidator: (rule: any, fieldValue: string, callback?: any) => {
      return CanNullValidator(rule, fieldValue, Validate.code, callback);
    }
  },

  nickname: {
    regex: /^[\u4E00-\u9FA5A-Za-z0-9_-]{1,20}$/,
    maxLength: 20,
    emptyErrorMsg: "请输入昵称",
    errorMsg: "昵称格式错误：只能包含中文，数字，字母，下划线，横杠，长度1-20",
    validate(value: string) {
      return this.regex.test(value);
    },
    validator: (rule: any, fieldValue: string, callback?: any) => {
      return Validator(rule, fieldValue, Validate.nickname, callback);
    },
    canNullValidator: (rule: any, fieldValue: string, callback?: any) => {
      return CanNullValidator(rule, fieldValue, Validate.nickname, callback);
    }
  },

  phone: {
    regex:
      /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
    maxLength: 20,
    emptyErrorMsg: "请输入手机号",
    errorMsg: "手机号格式错误",
    validate(value: string) {
      return this.regex.test(value);
    },
    validator: (rule: any, fieldValue: string, callback?: any) => {
      return Validator(rule, fieldValue, Validate.phone, callback);
    },
    canNullValidator: (rule: any, fieldValue: string, callback?: any) => {
      return CanNullValidator(rule, fieldValue, Validate.phone, callback);
    }
  },

  username: {
    regex: /^[\u4E00-\u9FA5A-Za-z0-9_-]{2,20}$/,
    maxLength: 20,
    emptyErrorMsg: "请输入用户名",
    errorMsg:
      "用户名格式错误：只能包含中文，数字，字母，下划线，横杠，长度2-20",
    validate(value: string) {
      return this.regex.test(value);
    },
    validator: (rule: any, fieldValue: string, callback?: any) => {
      return Validator(rule, fieldValue, Validate.username, callback);
    },
    canNullValidator: (rule: any, fieldValue: string, callback?: any) => {
      return CanNullValidator(rule, fieldValue, Validate.username, callback);
    }
  },

  url: {
    regex: /^[a-zA-Z]+:\/\/[\w-+&@#/%?=~_|!:,.;]*[\w-+&@#/%=~_|]$/,
    maxLength: 300,
    emptyErrorMsg: "请输入地址",
    errorMsg: "地址格式错误",
    validate(value: string) {
      return this.regex.test(value);
    },
    validator: (rule: any, fieldValue: string, callback?: any) => {
      return Validator(rule, fieldValue, Validate.url, callback);
    },
    canNullValidator: (rule: any, fieldValue: string, callback?: any) => {
      return CanNullValidator(rule, fieldValue, Validate.url, callback);
    }
  },

  bankDebitCard: {
    regex: /^(\d{16}|\d{19}|\d{17})$/,
    maxLength: 19,
    emptyErrorMsg: "请输入银行卡号",
    errorMsg: "银行卡号格式错误",
    validate(value: string) {
      return this.regex.test(value);
    },
    validator: (rule: any, fieldValue: string, callback?: any) => {
      return Validator(rule, fieldValue, Validate.bankDebitCard, callback);
    },
    canNullValidator: (rule: any, fieldValue: string, callback?: any) => {
      return CanNullValidator(
        rule,
        fieldValue,
        Validate.bankDebitCard,
        callback
      );
    }
  }
};
