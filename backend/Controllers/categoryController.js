import Category from '../Modals/categoryModal.js';

const fetchAllCategory = async (req, res) => {
    try {
        const data = await Category.find({});
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching categories', error });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, parentCategory } = req.body;
        
        const data = await Category.findById(id);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        data.name = name || data.name;
        data.image = image || data.image;
        data.parentCategory = parentCategory || data.parentCategory;

        await data.save();
        res.status(200).json({ success: true, message: 'Category updated', data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Category.findById(id);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        await Category.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (error) {
        console.error('Error in deleteCategory:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};


const createCategory = async (req, res) => {
    try {
        const { name, image, parentCategory } = req.body;
        const data = await Category.create({ name, image, parentCategory });

        res.status(201).json({ success: true, message: 'Category created', data });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Category name must be unique.', error });
        }
        res.status(500).json({ success: false, message: 'Error creating category', error });
    }
};

export { fetchAllCategory, updateCategory, deleteCategory, createCategory };
