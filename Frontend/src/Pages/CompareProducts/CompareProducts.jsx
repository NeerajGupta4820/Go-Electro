import { useSelector, useDispatch } from 'react-redux';
import { removeFromCompare } from '../../redux/slices/compareSlice';
import './CompareProducts.css';

const CompareProducts = () => {
  const products = useSelector(state => state.compare.products);
  const dispatch = useDispatch();
  // Fill up to 3 slots
  const compareSlots = [products[0] || null, products[1] || null, products[2] || null];
  const fields = [
    { label: 'Image', key: 'image' },
    { label: 'Name', key: 'title' },
    { label: 'Price', key: 'price' },
    { label: 'Rating', key: 'ratings' },
    { label: 'Category', key: 'category' },
    { label: 'Stock', key: 'stock' },
    { label: 'Description', key: 'description' },
  ];
  return (
    <div className="compare-table-container">
      <h2>Compare Products</h2>
      <table className="compare-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Product 1</th>
            <th>Product 2</th>
            <th>Product 3</th>
          </tr>
        </thead>
        <tbody>
          {fields.map(field => (
            <tr key={field.key}>
              <td>{field.label}</td>
              {compareSlots.map((product, idx) => (
                <td key={idx} style={{ position: 'relative', verticalAlign: 'top' }}>
                  {product ? (
                    <>
                      {field.key === 'image' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <img src={product.images[0]?.imageLinks[0]} alt={product.title} style={{ width: 60, height: 60, borderRadius: 8, marginBottom: 6 }} />
                          <button
                            className="compare-table-remove-btn"
                            title="Remove"
                            style={{ marginTop: 2, background: '#dc3545', color: '#fff', border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: '0.95rem', cursor: 'pointer', transition: 'background 0.18s' }}
                            onClick={() => dispatch(removeFromCompare(product._id))}
                            onMouseEnter={e => e.target.style.background = '#a71d2a'}
                            onMouseLeave={e => e.target.style.background = '#dc3545'}
                          >Remove</button>
                        </div>
                      ) : field.key === 'category' ? (
                        product.category?.name || '-'
                      ) : (
                        product[field.key] || '-'
                      )}
                    </>
                  ) : (
                    '-'
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompareProducts;
