/* eslint-disable @next/next/no-img-element */
import initTranslations from '@/app/i18n';

interface OrderConfirmationProps {
  locale: string;
  orderId: string;
  data: {
    shippingInfo: {
      street: string;
      city: string;
      country: string;
      postalCode: string;
    };
    items: {
      productName: string;
      quantity: number;
      price: number;
      total: number;
    }[];
  };
}
export const OrderConfirmation = async ({
  locale,
  orderId,
  data,
}: OrderConfirmationProps) => {
  const { t } = await initTranslations(locale, ['email']);
  const orderTotal = data.items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          backgroundColor: '#ffffff',
          padding: '30px 20px',
          borderRadius: '8px 8px 0 0',
          borderBottom: '3px solid #000000',
        }}
      >
        <h1 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '28px' }}>
          Shop Realm
        </h1>
        <h2 style={{ color: '#000000', margin: '0', fontSize: '20px' }}>
          {t('orderPlaced')}
        </h2>
      </div>

      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderLeft: '1px solid #ddd',
          borderRight: '1px solid #ddd',
        }}
      >
        <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '16px' }}>
          {t('orderPlacedDesc')}
        </p>
        <p
          style={{
            margin: '0',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          {t('orderNr')}: <span style={{ color: '#0000000' }}>{orderId}</span>
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderLeft: '1px solid #ddd',
          borderRight: '1px solid #ddd',
        }}
      >
        <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px' }}>
          {t('orderItems')}
        </h3>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            margin: '0',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th
                style={{
                  padding: '12px 8px',
                  textAlign: 'left',
                  borderBottom: '2px solid #dee2e6',
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {t('product')}
              </th>
              <th
                style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  borderBottom: '2px solid #dee2e6',
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {t('quantity')}
              </th>
              <th
                style={{
                  padding: '12px 8px',
                  textAlign: 'right',
                  borderBottom: '2px solid #dee2e6',
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {t('price')}
              </th>
              <th
                style={{
                  padding: '12px 8px',
                  textAlign: 'right',
                  borderBottom: '2px solid #dee2e6',
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {t('total')}
              </th>
            </tr>
          </thead>

          <tbody>
            {data.items.map((item, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                }}
              >
                <td
                  style={{
                    padding: '12px 8px',
                    borderBottom: '1px solid #dee2e6',
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  {item.productName}
                </td>
                <td
                  style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    borderBottom: '1px solid #dee2e6',
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  style={{
                    padding: '12px 8px',
                    textAlign: 'right',
                    borderBottom: '1px solid #dee2e6',
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  €{item.price.toFixed(2)}
                </td>
                <td
                  style={{
                    padding: '12px 8px',
                    textAlign: 'right',
                    borderBottom: '1px solid #dee2e6',
                    color: '#333',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  €{item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td
                colSpan={3}
                style={{
                  padding: '15px 8px',
                  textAlign: 'right',
                  borderTop: '2px solid #000000',
                  color: '#333',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                {t('orderTotal')}:
              </td>
              <td
                style={{
                  padding: '15px 8px',
                  textAlign: 'right',
                  borderTop: '2px solid #000000',
                  color: '#000000',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                €{orderTotal.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderLeft: '1px solid #ddd',
          borderRight: '1px solid #ddd',
        }}
      >
        <h3 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '18px' }}>
          {t('shippingAddress')}
        </h3>
        <div
          style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '4px',
            borderLeft: '4px solid #000000',
          }}
        >
          <p style={{ margin: '0 0 5px 0', color: '#333', fontSize: '14px' }}>
            {data.shippingInfo.street}
          </p>
          <p style={{ margin: '0 0 5px 0', color: '#333', fontSize: '14px' }}>
            {data.shippingInfo.city}, {data.shippingInfo.postalCode}
          </p>
          <p style={{ margin: '0', color: '#333', fontSize: '14px' }}>
            {t(data.shippingInfo.country)}
          </p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          textAlign: 'center',
          borderRadius: '0 0 8px 8px',
          border: '1px solid #ddd',
          borderTop: 'none',
        }}
      >
        <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
          {t('thankYouForOrder')}
        </p>
      </div>
    </div>
  );
};
