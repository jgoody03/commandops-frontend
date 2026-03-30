export type SignupFormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  businessName: string;
  businessType: string;
  expectedLocationCount: string;
  setupPreference: "start_now" | "device_later";
};