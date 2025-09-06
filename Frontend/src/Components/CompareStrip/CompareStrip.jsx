import { useSelector, useDispatch } from 'react-redux';
import { removeFromCompare, clearCompare } from '../../redux/slices/compareSlice';
import { useNavigate } from 'react-router-dom';
import './CompareStrip.css';

const CompareStrip = () => {
  const products = useSelector(state => state.compare.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (products.length === 0) return null;
  return (
    <div className="compare-strip">
      <div className="compare-strip-left">
        <div className="compare-products">
          {products.map(product => (
            <div className="compare-product" key={product._id}>
              <img src={product.images[0]?.imageLinks[0]} alt={product.title} className="compare-product-img" />
              <span className="compare-product-name">{product.title}</span>
              <button className="compare-remove-btn" title="Remove" onClick={() => dispatch(removeFromCompare(product._id))}>&times;</button>
            </div>
          ))}
        </div>
      </div>
      <div className="compare-strip-right">
        <button className="compare-btn" onClick={() => navigate('/compare')}>Compare</button>
        <button className="compare-clear-btn" onClick={() => dispatch(clearCompare())}>Remove All</button>
      </div>
    </div>
  );
};

export default CompareStrip;
