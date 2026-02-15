import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Pagination from '@mui/material/Pagination';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slider from '@mui/material/Slider';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { clearErrors, getProducts } from '../../actions/productAction';
import Loader from '../Layouts/Loader';
import MinCategory from '../Layouts/MinCategory';
import Product from './Product';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import StarIcon from '@mui/icons-material/Star';
import { categories } from '../../utils/constants';
import MetaData from '../Layouts/MetaData';

const Products = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const location = useLocation();

    const [price, setPrice] = useState([0, 200000]);
    const [category, setCategory] = useState(location.search ? location.search.split("=")[1] : "");
    const [ratings, setRatings] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);

    const [categoryToggle, setCategoryToggle] = useState(true);
    const [ratingsToggle, setRatingsToggle] = useState(true);

    // ✅ Redux selector (FIXED)
    const {
        products,
        loading,
        error,
        resultPerPage,
        filteredProductsCount
    } = useSelector((state) => state.products);

    const keyword = params.keyword;

    const priceHandler = (e, newPrice) => {
        setPrice(newPrice);
    };

    const clearFilters = () => {
        setPrice([0, 200000]);
        setCategory("");
        setRatings(0);
    };

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }

        dispatch(getProducts(keyword, category, price, ratings, currentPage));
    }, [dispatch, keyword, category, price, ratings, currentPage, error, enqueueSnackbar]);

    return (
        <>
            <MetaData title="All Products | Flipkart" />

            <MinCategory />
            <main className="w-full mt-14 sm:mt-0">

                <div className="flex gap-3 mt-2 sm:mt-2 sm:mx-3 m-auto mb-7">

                    <div className="hidden sm:flex flex-col w-1/5 px-1">

                        <div className="flex flex-col bg-white rounded-sm shadow">

                            <div className="flex items-center justify-between gap-5 px-4 py-2 border-b">
                                <p className="text-lg font-medium">Filters</p>
                                <span className="uppercase text-primary-blue text-xs cursor-pointer font-medium"
                                    onClick={clearFilters}>clear all</span>
                            </div>

                            <div className="flex flex-col gap-2 py-3 text-sm overflow-hidden">

                                <div className="flex flex-col gap-2 border-b px-4">
                                    <span className="font-medium text-xs">PRICE</span>

                                    <Slider
                                        value={price}
                                        onChange={priceHandler}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={200000}
                                    />

                                    <div className="flex gap-3 items-center justify-between mb-2">
                                        <span className="flex-1 border px-4 py-1 rounded-sm bg-gray-50">₹{price[0].toLocaleString()}</span>
                                        <span className="font-medium text-gray-400">to</span>
                                        <span className="flex-1 border px-4 py-1 rounded-sm bg-gray-50">₹{price[1].toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col border-b px-4">
                                    <div className="flex justify-between cursor-pointer py-2 pb-4 items-center"
                                        onClick={() => setCategoryToggle(!categoryToggle)}>
                                        <p className="font-medium text-xs uppercase">Category</p>
                                        {categoryToggle ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </div>

                                    {categoryToggle && (
                                        <FormControl>
                                            <RadioGroup value={category} onChange={(e) => setCategory(e.target.value)}>
                                                {categories.map((el, i) => (
                                                    <FormControlLabel key={i} value={el} control={<Radio size="small" />} label={el} />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    )}
                                </div>

                                <div className="flex flex-col border-b px-4">
                                    <div className="flex justify-between cursor-pointer py-2 pb-4 items-center"
                                        onClick={() => setRatingsToggle(!ratingsToggle)}>
                                        <p className="font-medium text-xs uppercase">ratings</p>
                                        {ratingsToggle ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </div>

                                    {ratingsToggle && (
                                        <FormControl>
                                            <RadioGroup value={ratings} onChange={(e) => setRatings(e.target.value)}>
                                                {[4, 3, 2, 1].map((el, i) => (
                                                    <FormControlLabel
                                                        key={i}
                                                        value={el}
                                                        control={<Radio size="small" />}
                                                        label={<span className="flex items-center">{el}<StarIcon sx={{ fontSize: 12 }} /> & above</span>}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="flex-1">

                        {!loading && products?.length === 0 && (
                            <div className="flex flex-col items-center justify-center gap-3 bg-white p-10">
                                <h1>No products found</h1>
                            </div>
                        )}

                        {loading ? <Loader /> : (
                            <div className="flex flex-col gap-2 items-center bg-white">

                                <div className="grid grid-cols-1 sm:grid-cols-4 w-full pb-4 border-b">
                                    {products?.map(product => (
                                        <Product {...product} key={product._id} />
                                    ))}
                                </div>

                                {filteredProductsCount > resultPerPage && (
                                    <Pagination
                                        count={Math.ceil(filteredProductsCount / resultPerPage)}
                                        page={currentPage}
                                        onChange={(e, val) => setCurrentPage(val)}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Products;
