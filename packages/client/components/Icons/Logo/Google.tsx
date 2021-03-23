import { Base, IconBaseFProps } from "../Base";

export const Google: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.6 12.227c0-.709-.064-1.39-.182-2.045H12v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z"
        fill="#4285F4"
        style={{ strokeWidth: 0 }}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H3.064v2.59A9.996 9.996 0 0012 22z"
        fill="#34A853"
        style={{ strokeWidth: 0 }}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.405 13.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V7.51H3.064A9.996 9.996 0 002 12c0 1.614.386 3.14 1.064 4.49l3.34-2.59z"
        fill="#FBBC05"
        style={{ strokeWidth: 0 }}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 5.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C16.959 2.99 14.695 2 12 2 8.09 2 4.71 4.24 3.064 7.51l3.34 2.59C7.192 7.736 9.396 5.977 12 5.977z"
        fill="#EA4335"
        style={{ strokeWidth: 0 }}
      />
    </Base>
  );
};

Google.displayName = "LogoGoogle";
