import type { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  ApiProvider as GearApiProvider,
  AlertProvider as GearAlertProvider,
  AccountProvider as GearAccountProvider,
  ProviderProps,
} from '@gear-js/react-hooks';
import { DnsProvider as SharedDnsProvider } from '@dapps-frontend/hooks';
import { QueryProvider } from '@dapps-frontend/ui';
import { Alert, alertStyles } from 'components/ui/alert';
import { AppProvider, GameProvider } from 'app/context';
import { ENV } from 'app/consts';

const ApiProvider = ({ children }: ProviderProps) => (
  <GearApiProvider initialArgs={{ endpoint: ENV.NODE }}>{children}</GearApiProvider>
);

function AccountProvider({ children }: ProviderProps) {
  return <GearAccountProvider appName="Vara Tequila Train">{children}</GearAccountProvider>;
}

function DnsProvider({ children }: ProviderProps) {
  return (
    <SharedDnsProvider names={{ programId: ENV.DNS_NAME }} dnsApiUrl={ENV.DNS_API_URL}>
      {children}
    </SharedDnsProvider>
  );
}

function AlertProvider({ children }: ProviderProps) {
  return (
    <GearAlertProvider template={Alert} containerClassName={alertStyles.root}>
      {children}
    </GearAlertProvider>
  );
}

const providers = [
  BrowserRouter,
  AlertProvider,
  ApiProvider,
  DnsProvider,
  AccountProvider,
  AppProvider,
  GameProvider,
  QueryProvider,
];

export const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);
