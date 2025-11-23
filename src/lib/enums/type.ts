export enum EGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum EUserType {
  CUSTOMER = 'CUSTOMER',
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
}

export enum ECustomerType {
  REGULAR = 'REGULAR',
  VIP = 'VIP',
}

export enum EDiscountType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
}

export enum ESenderType {
  AI = 'AI',
  USER = 'USER',
}

export enum EDeliveryType {
  HOME_DELIVERY = 'HOME_DELIVERY',
  PICKUP_AT_STORE = 'PICKUP_AT_STORE',
}

export enum EPaymentMethod {
  CASH = 'CASH',
  ONLINE = 'ONLINE',
}

export enum EPaymentProvider {
  MOMO = 'MOMO',
  VNPAY = 'VNPAY',
  PAYOS = 'PAYOS',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum EDivisionType {
  CITY = 'thành phố trung ương',
  PROVINCE = 'tỉnh',
  WARD = 'phường',
  COMMUNE = 'xã',
}
