import React, { useState } from 'react';
import {
  IonContent,
  IonList,
  IonModal,
  IonHeader,
  IonItem,
  IonInput,
  IonIcon,
} from '@ionic/react';
import { CurrencyIcon } from '../icons';
import { closeSharp, searchSharp } from 'ionicons/icons';
import { AssetWithTicker } from '../../utils/tdex';
import './style.scss';

interface ExchangeSearchProps {
  prices: Record<string, number>;
  assets: AssetWithTicker[];
  setAsset: (newAsset: AssetWithTicker) => void;
  isOpen: boolean;
  close: () => void;
  currency: string;
  isDepositSearch?: boolean;
}

const ExchangeSearch: React.FC<ExchangeSearchProps> = ({
  prices,
  assets,
  setAsset,
  isOpen,
  close,
  currency,
  isDepositSearch = false,
}) => {
  const [searchString, setSearchString] = useState('');

  return (
    <div className="search">
      <IonModal cssClass="modal-small" isOpen={isOpen} onDidDismiss={close}>
        <IonHeader>
          <div>
            <label className="search-bar">
              <IonIcon
                icon={searchSharp}
                color="light-contrast"
                onClick={close}
              />
              <IonInput
                inputMode="search"
                color="light-contrast"
                placeholder="Search currency"
                value={searchString}
                onIonChange={(e) =>
                  setSearchString(e.detail.value?.toLowerCase() || '')
                }
              />
              <IonIcon
                icon={closeSharp}
                color="light-contrast"
                onClick={close}
              />
            </label>
          </div>
        </IonHeader>
        <IonContent className="search-content">
          <IonList>
            {assets
              .filter(
                (asset: AssetWithTicker) =>
                  asset.asset.toLowerCase().includes(searchString) ||
                  asset.ticker.toLowerCase().includes(searchString) ||
                  asset.coinGeckoID?.toLowerCase().includes(searchString)
              )
              .map((asset: AssetWithTicker, index: number) => {
                return (
                  <IonItem
                    key={index}
                    data-asset={index}
                    onClick={() => {
                      setAsset(asset);
                      close();
                    }}
                  >
                    <div
                      // https://github.com/ionic-team/ionic-framework/issues/21939#issuecomment-694259307
                      tabIndex={0}
                    ></div>
                    <div className="search-item-name">
                      <span className="icon-wrapper medium">
                        <CurrencyIcon currency={asset.ticker} />
                      </span>
                      <p>{asset.ticker}</p>
                    </div>
                    {!isDepositSearch && (
                      <div className="search-item-amount">
                        <p>
                          <span className="price-equivalent">
                            {(asset.coinGeckoID && prices[asset.coinGeckoID]) ||
                              '?'}
                          </span>
                          <span>{currency.toUpperCase()}</span>
                        </p>
                      </div>
                    )}
                  </IonItem>
                );
              })}
          </IonList>
        </IonContent>
      </IonModal>
    </div>
  );
};

export default ExchangeSearch;
