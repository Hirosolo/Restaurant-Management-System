import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPage.css';

function MenuPage({ 
  cart: propCart, 
  setCart: setPropCart, 
  authStatus: propAuthStatus, 
  setAuthStatus: setPropAuthStatus,
  userAddress: propUserAddress,
  setUserAddress: setPropUserAddress 
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState({});
  const [categoriesOpen, setCategoriesOpen] = useState({});
  const [noteOpen, setNoteOpen] = useState({});
  const navRef = useRef(null);
  const overlayRef = useRef(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [block, setBlock] = useState('');
  const [floor, setFloor] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [street, setStreet] = useState('');

  const [wardDropdownOpen, setWardDropdownOpen] = useState(false);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [streetDropdownOpen, setStreetDropdownOpen] = useState(false);

  const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];
  const districts = ['District 1', 'District 2', 'District 3', 'District 4', 'District 5'];
  const streets = ['Street 1', 'Street 2', 'Street 3', 'Street 4', 'Street 5'];

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [tempItemToAdd, setTempItemToAdd] = useState(null);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactMobile, setContactMobile] = useState('');

  // Đồng bộ state với props
  useEffect(() => {
    if (propCart && propCart.length > 0) setCart(propCart);
  }, [propCart]);
  
  useEffect(() => {
    if (propUserAddress) setUserAddress(propUserAddress);
  }, [propUserAddress]);
  
  useEffect(() => {
    if (cart !== propCart && setPropCart) setPropCart(cart);
  }, [cart, setPropCart, propCart]);
  
  useEffect(() => {
    if (userAddress !== propUserAddress && setPropUserAddress) setPropUserAddress(userAddress);
  }, [userAddress, setPropUserAddress, propUserAddress]);

  // Theo dõi propAuthStatus để điều hướng
  useEffect(() => {
    console.log('propAuthStatus updated:', propAuthStatus);
    if (propAuthStatus === 'signedIn') {
      console.log('Navigating to /account');
      navigate('/account');
    }
  }, [propAuthStatus, navigate]);

  const recipeDetails = {
    "RCP-001": { name: "Pecan Crusted Salmon", calories: "488", protein: "54.4", fat: "22.4", fiber: "3.4", carb: "18.6", description: "Savor the delightful crunch of Pecan Crusted Salmon, where tender, flaky salmon fillets are coated with a nutty pecan crust. The rich, buttery pecans perfectly complement the salmon's natural flavors, while a hint of seasoning adds depth. Baked to golden perfection, this dish offers a satisfying balance of protein and healthy fats, making it a wholesome yet indulgent meal for any occasion." },
    "RCP-002": { name: "Blackened Salmon", calories: "468", protein: "50.6", fat: "30.4", fiber: "0.0", carb: "0.0", description: "Experience the bold flavors of Blackened Salmon, a Cajun-inspired dish that's as fiery as it is delicious. Juicy salmon fillets are coated in a smoky, spicy seasoning blend and seared to create a perfectly charred crust while keeping the inside tender and moist. This fast and easy recipe brings a burst of Southern flair to your plate, ideal for a quick yet impressive dinner." },
    "RCP-003": { name: "Salmon Burger", calories: "694", protein: "56.6", fat: "37.2", fiber: "2.6", carb: "30.6", description: "Dive into the hearty goodness of a Salmon Burger, where succulent salmon is transformed into a flavorful patty. Packed with protein and a touch of zest, this burger is grilled to perfection and served with fresh toppings on a soft bun. The combination of tender salmon, crisp veggies, and a creamy sauce makes every bite a delightful mix of textures and tastes." },
    "RCP-004": { name: "Tuna Cakes", calories: "368", protein: "31.2", fat: "18.8", fiber: "1.0", carb: "15.2", description: "Enjoy the comforting simplicity of Tuna Cakes, a quick and tasty dish that's perfect for any meal. Flaky tuna is mixed with savory seasonings and a touch of breadcrumbs, then pan-fried to a golden crisp. These patties are light yet satisfying, with a tender interior and a crunchy exterior, offering a delightful seafood twist on a classic comfort food." },
    "RCP-005": { name: "Cajun Grilled Shrimp", calories: "252", protein: "45.6", fat: "8.2", fiber: "0.0", carb: "0.0", description: "Spice up your meal with Cajun Grilled Shrimp, where plump, juicy shrimp are marinated in a zesty Cajun seasoning and grilled to smoky perfection. Each bite bursts with bold flavors, from the heat of the spices to the natural sweetness of the shrimp. This low-carb dish is perfect for a light, flavorful dinner that doesn't skimp on taste." },
    "RCP-006": { name: "Lettuce Wrap", calories: "456", protein: "25.4", fat: "28.6", fiber: "10.0", carb: "29.0", description: "Fresh, crunchy, and oh-so-satisfying, these Easy Lettuce Wraps are a healthy yet flavorful option for any meal. Crisp lettuce leaves cradle a savory filling of seasoned protein, vibrant veggies, and a drizzle of tangy sauce. With a perfect balance of textures and a burst of freshness, these wraps are a guilt-free way to enjoy bold flavors." },
    "RCP-007": { name: "Eggplant Parmigiana", calories: "588", protein: "23.4", fat: "36.6", fiber: "8.4", carb: "40.6", description: "Indulge in the comforting layers of Eggplant Parmigiana, a classic Italian dish that's both hearty and wholesome. Slices of tender eggplant are breaded, baked, and layered with rich marinara sauce and melty cheese, creating a symphony of flavors. Each bite offers a perfect blend of savory, cheesy goodness and the subtle sweetness of eggplant." },
    "RCP-008": { name: "Chicken Meatballs", calories: "472", protein: "36.2", fat: "28.6", fiber: "1.8", carb: "15.2", description: "These Baked Chicken Meatballs are a crowd-pleaser, offering tender, juicy bites packed with flavor. Made with lean ground chicken and seasoned with herbs and spices, they're baked to a golden finish. Perfect on their own, with a dipping sauce, or tossed in your favorite pasta, these meatballs are a versatile and delicious addition to any meal." },
    "RCP-009": { name: "Smoked Salmon Salad", calories: "456", protein: "25.4", fat: "32.0", fiber: "5.4", carb: "20.2", description: "Elevate your dinner with a Smoked Salmon Salad, a fast and easy dish that's as elegant as it is nutritious. Flaky smoked salmon sits atop a bed of crisp greens, paired with creamy avocado, tangy dressing, and a sprinkle of fresh herbs. This salad is a perfect harmony of smoky, fresh, and zesty flavors in every bite." },
    "RCP-010": { name: "Lemon Garlic Chicken", calories: "398", protein: "42.0", fat: "20.6", fiber: "0.0", carb: "0.0", description: "Bright and savory, Lemon Garlic Chicken is a dish that brings sunshine to your plate. Juicy chicken breasts are marinated in a zesty lemon-garlic blend, then seared to lock in the flavors. The result is a tender, aromatic dish with a perfect balance of citrusy brightness and garlicky depth, ideal for a comforting yet light meal." },
    "RCP-011": { name: "Pan Seared Chicken Breast", calories: "398", protein: "42.0", fat: "20.6", fiber: "0.0", carb: "0.0", description: "Simplicity meets perfection in this Pan Seared Chicken Breast. Tender chicken breasts are seasoned and seared to a golden crust, keeping the inside juicy and flavorful. With a hint of herbs and a touch of butter, this dish is a versatile classic that pairs beautifully with any side, making it a go-to for busy weeknights." },
    "RCP-012": { name: "Baked Chicken Thighs", calories: "426", protein: "37.4", fat: "27.6", fiber: "0.0", carb: "0.0", description: "Discover the magic of Baked Chicken Thighs, where crispy, golden skin gives way to juicy, tender meat. Seasoned with a blend of herbs and spices, these thighs are baked to perfection, offering a rich, savory flavor in every bite. This dish is a comforting, no-fuss option that's sure to become a family favorite." },
    "RCP-013": { name: "Chicken Nuggets", calories: "460", protein: "28.0", fat: "28.0", fiber: "2.0", carb: "20.0", description: "Relive your childhood with these Homemade Chicken Nuggets, a healthier take on a classic. Made with tender chicken breast and a crispy breadcrumb coating, these nuggets are baked to golden perfection. They're crunchy on the outside, juicy on the inside, and perfect for dipping in your favorite sauce—a fun and delicious treat for all ages." },
    "RCP-014": { name: "Honey Garlic Chicken Thighs", calories: "504", protein: "38.0", fat: "28.0", fiber: "1.0", carb: "30.0", description: "Sweet, sticky, and savory, Honey Garlic Chicken Thighs are a flavor-packed dish that's sure to impress. Juicy chicken thighs are glazed with a luscious honey-garlic sauce, then baked until caramelized and tender. The perfect balance of sweet and savory makes this dish a delightful option for a cozy dinner." },
    "RCP-015": { name: "Chicken Caesar Salad", calories: "480", protein: "38.0", fat: "32.0", fiber: "4.0", carb: "16.0", description: "Crisp, creamy, and classic, this Chicken Caesar Salad is a timeless favorite. Tender grilled chicken sits atop a bed of crunchy romaine lettuce, tossed with a tangy Caesar dressing, croutons, and a sprinkle of Parmesan. Each bite offers a perfect mix of flavors and textures, making it a satisfying meal for any day." },
    "RCP-016": { name: "Grilled Chicken Salad", calories: "462", protein: "40.0", fat: "28.0", fiber: "5.0", carb: "18.0", description: "Fresh and hearty, this Grilled Chicken Salad is a vibrant dish that's as nutritious as it is delicious. Juicy grilled chicken is paired with crisp greens, colorful veggies, and a zesty dressing, creating a balanced meal that's bursting with flavor. It's the perfect choice for a light yet satisfying lunch or dinner." },
    "RCP-017": { name: "Garlic Butter Noodles", calories: "420", protein: "10.0", fat: "18.0", fiber: "2.0", carb: "56.0", description: "Indulge in the comforting simplicity of Garlic Butter Noodles, where tender pasta is tossed in a rich, garlicky butter sauce. A sprinkle of fresh herbs and a dash of Parmesan elevate this dish, making it a quick yet luxurious side or main. Each bite is a warm, buttery delight that's hard to resist." },
    "RCP-018": { name: "Cajun Shrimp Pasta", calories: "496", protein: "34.0", fat: "24.0", fiber: "3.0", carb: "36.0", description: "Turn up the heat with Cajun Shrimp Pasta, a creamy, spicy dish that's packed with bold flavors. Juicy shrimp are sautéed with Cajun spices and tossed with tender pasta in a luscious, creamy sauce. This dish offers a perfect balance of heat, creaminess, and seafood goodness, making it a standout meal." },
    "RCP-019": { name: "Pasta Pomodoro", calories: "420", protein: "12.0", fat: "14.0", fiber: "4.0", carb: "60.0", description: "Savor the taste of Italy with Pasta Pomodoro, a simple yet exquisite dish. Al dente pasta is tossed in a vibrant, fresh tomato sauce made with ripe tomatoes, garlic, and basil. The bright, tangy flavors of the sauce shine through in every bite, making this a light yet satisfying meal that's pure comfort." },
    "RCP-020": { name: "Creamy Shrimp Pasta", calories: "520", protein: "36.0", fat: "26.0", fiber: "2.0", carb: "40.0", description: "Dive into the decadence of Creamy Shrimp Pasta, where succulent shrimp are nestled in a velvety, creamy sauce. Tossed with tender pasta, this dish is rich yet balanced, with the natural sweetness of the shrimp shining through. It's a luxurious meal that's perfect for a special dinner or a cozy night in." },
    "RCP-021": { name: "Scallop Pasta with Lemon & Herbs", calories: "484", protein: "34.0", fat: "20.0", fiber: "3.0", carb: "45.0", description: "Elegant and refreshing, Scallop Pasta with Lemon & Herbs is a seafood lover's dream. Perfectly seared scallops are paired with tender pasta, a zesty lemon sauce, and a sprinkle of fresh herbs. The bright, citrusy notes complement the delicate sweetness of the scallops, creating a light yet flavorful dish." },
    "RCP-022": { name: "Tofu Fried Rice", calories: "460", protein: "22.0", fat: "20.0", fiber: "4.0", carb: "48.0", description: "Satisfy your cravings with Tofu Fried Rice, a hearty and flavorful dish that's perfect for any meal. Crispy tofu cubes are stir-fried with fluffy rice, colorful veggies, and a savory soy-based sauce. Each bite offers a delightful mix of textures and umami flavors, making this a wholesome and delicious option." },
    "RCP-023": { name: "Breaded Tofu Burger", calories: "452", protein: "20.0", fat: "18.0", fiber: "4.0", carb: "48.0", description: "Bite into the crispy, savory goodness of a Breaded Tofu Burger. A golden, breaded tofu patty is nestled in a soft bun with fresh toppings and a tangy sauce, creating a satisfying plant-based sandwich. The crunch of the tofu paired with the freshness of the veggies makes this burger a delightful meat-free treat." },
    "RCP-024": { name: "Tofu Salad", calories: "416", protein: "22.0", fat: "20.0", fiber: "5.0", carb: "30.0", description: "Light, fresh, and nutritious, this Tofu Salad is a perfect balance of flavors and textures. Cubes of tender tofu are paired with crisp greens, vibrant veggies, and a zesty dressing, creating a refreshing dish that's as healthy as it is delicious. It's an ideal choice for a quick, guilt-free meal." },
    "RCP-025": { name: "Shrimp Fried Rice", calories: "478", protein: "28.0", fat: "18.0", fiber: "3.0", carb: "50.0", description: "Savor the bold flavors of Shrimp Fried Rice, where juicy shrimp are stir-fried with fluffy rice, colorful veggies, and a savory sauce. Each bite is packed with umami goodness, with the sweetness of the shrimp shining through. This hearty dish is a perfect one-pan meal that's both satisfying and delicious." },
    "RCP-026": { name: "Shrimp Burger", calories: "442", protein: "26.0", fat: "16.0", fiber: "3.0", carb: "44.0", description: "Enjoy the light and flavorful Shrimp Burger, where tender shrimp are formed into a juicy patty and grilled to perfection. Served on a soft bun with fresh toppings and a zesty sauce, this burger offers a delightful seafood twist on a classic. It's a refreshing and protein-packed option for any meal." },
    "RCP-027": { name: "Pan Seared Scallops", calories: "436", protein: "32.0", fat: "20.0", fiber: "2.0", carb: "30.0", description: "Treat yourself to the elegance of Pan Seared Scallops, where plump scallops are seared to a golden crust while remaining tender and buttery inside. A touch of garlic and lemon enhances their natural sweetness, making each bite a luxurious experience. This dish is perfect for a special occasion or a fancy dinner at home." },
    "RCP-028": { name: "Classic Bean Soup", calories: "398", protein: "24.0", fat: "12.0", fiber: "8.0", carb: "42.0", description: "Warm up with a bowl of Classic Bean Soup, a hearty and comforting dish that's perfect for chilly days. Tender beans are simmered with aromatic veggies and herbs, creating a rich, flavorful broth. This wholesome soup is packed with fiber and protein, making it a nourishing meal that warms both body and soul." },
    "RCP-029": { name: "Tofu Soup with Spinach", calories: "372", protein: "20.0", fat: "10.0", fiber: "5.0", carb: "34.0", description: "Light yet satisfying, Tofu Soup with Spinach is a nourishing dish that's bursting with fresh flavors. Silky tofu and vibrant spinach are simmered in a fragrant broth, with a hint of garlic and ginger for depth. This healthy soup is a perfect way to enjoy a comforting, plant-based meal." },
    "RCP-030": { name: "Carrot Soup", calories: "360", protein: "8.0", fat: "14.0", fiber: "5.0", carb: "50.0", description: "Bright and velvety, Carrot Soup is a comforting dish that highlights the natural sweetness of carrots. Blended with aromatic spices and a touch of cream, this soup is smooth and flavorful, with a vibrant orange hue that's as beautiful as it is delicious. It's a perfect starter or light meal for any day." },
    "RCP-031": { name: "Classic Tomato Soup", calories: "350", protein: "7.0", fat: "12.0", fiber: "4.0", carb: "48.0", description: "Savor the timeless comfort of Classic Tomato Soup, where ripe tomatoes are simmered with garlic, onions, and herbs to create a rich, tangy broth. Blended to a silky smooth texture and finished with a touch of cream, this soup is a warm, nostalgic hug in a bowl—perfect with a side of crusty bread." },
    "RCP-032": { name: "Garlic Butter Salmon", calories: "490", protein: "36.0", fat: "28.0", fiber: "2.0", carb: "22.0", description: "Indulge in the rich, savory flavors of Garlic Butter Salmon, where tender salmon fillets are pan-seared and drizzled with a luscious garlic butter sauce. The buttery, garlicky goodness enhances the salmon's natural richness, creating a melt-in-your-mouth experience. This dish is a simple yet decadent option for seafood lovers." }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const toggleFilter = (filterId) => {
    setFiltersOpen(prev => ({
      ...prev,
      [filterId]: !prev[filterId]
    }));
  };
  
  const toggleCategory = (categoryId) => {
    setCategoriesOpen(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleNote = (itemId) => {
    setNoteOpen(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const showRecipeDetails = (recipeId) => {
    setSelectedRecipe(recipeId);
    setShowDetailPopup(true);
  };
  
  const closeDetailPopup = () => {
    setShowDetailPopup(false);
    setSelectedRecipe(null);
  };

  const handleAccountClick = (e) => {
    e.preventDefault();
    if (propAuthStatus === 'signedIn') {
      navigate('/account');
    } else {
      setShowAuthModal(true);
    }
  };

  const categories = [
    {
      id: 1,
      name: 'Main Meals',
      items: [
        { id: 101, name: 'Pecan Crusted Salmon', price: 26.10, rating: 5, image: '/assets/RCP-001.jpg' },
        { id: 102, name: 'Blackened Salmon', price: 26.10, rating: 5, image: '/assets/RCP-002.jpg' },
        { id: 103, name: 'Salmon Burger', price: 26.10, rating: 5, image: '/assets/RCP-003.webp' },
        { id: 104, name: 'Tuna Cakes', price: 26.10, rating: 5, image: '/assets/RCP-004.webp' },
        { id: 105, name: 'Cajun Grilled Shrimp', price: 26.10, rating: 5, image: '/assets/RCP-005.jpg' },
        { id: 106, name: 'Eggplant Parmigiana', price: 26.10, rating: 5, image: '/assets/RCP-007.jpg' },
        { id: 107, name: 'Chicken Meatballs', price: 26.10, rating: 5, image: '/assets/RCP-008.webp' },
        { id: 108, name: 'Lemon Garlic Chicken', price: 26.10, rating: 5, image: '/assets/RCP-010.jpg' },
        { id: 109, name: 'Pan Seared Chicken Breast', price: 26.10, rating: 5, image: '/assets/RCP-011.webp' },
        { id: 110, name: 'Baked Chicken Thighs', price: 26.10, rating: 5, image: '/assets/RCP-012.jpg' },
        { id: 111, name: 'Chicken Nuggets', price: 26.10, rating: 5, image: '/assets/RCP-013.webp' },
        { id: 112, name: 'Honey Garlic Chicken Thighs', price: 26.10, rating: 5, image: '/assets/RCP-014.webp' },
        { id: 113, name: 'Shrimp Burger', price: 26.10, rating: 5, image: '/assets/RCP-025.jpg' },
        { id: 114, name: 'Breaded Tofu Burger', price: 26.10, rating: 5, image: '/assets/RCP-022.webp' }
      ]
    },
    {
      id: 2,
      name: 'Salads',
      items: [
        { id: 201, name: 'Smoked Salmon Salad', price: 26.10, rating: 5, image: '/assets/RCP-009.jpg' },
        { id: 202, name: 'Chicken Caesar Salad', price: 26.10, rating: 5, image: '/assets/RCP-015.webp' },
        { id: 203, name: 'Grilled Chicken Salad', price: 26.10, rating: 5, image: '/assets/RCP-016.webp' },
        { id: 204, name: 'Tofu Salad', price: 26.10, rating: 5, image: '/assets/RCP-023.webp' }
      ]
    },
    {
      id: 3,
      name: 'Pasta & Noodles',
      items: [
        { id: 301, name: 'Garlic Butter Noodles', price: 26.10, rating: 5, image: '/assets/RCP-017.jpg' },
        { id: 302, name: 'Cajun Shrimp Pasta', price: 26.10, rating: 5, image: '/assets/RCP-018.jpg' },
        { id: 303, name: 'Pasta Pomodoro', price: 26.10, rating: 5, image: '/assets/RCP-019.jpg' },
        { id: 304, name: 'Creamy Shrimp Pasta', price: 26.10, rating: 5, image: '/assets/RCP-020.jpg' },
        { id: 305, name: 'Scallop Pasta with Lemon & Herbs', price: 26.10, rating: 5, image: '/assets/RCP-021.jpg' }
      ]
    },
    {
      id: 4,
      name: 'Rice Dishes',
      items: [
        { id: 401, name: 'Tofu Fried Rice', price: 26.10, rating: 5, image: '/assets/RCP-022.webp' },
        { id: 402, name: 'Shrimp Fried Rice', price: 26.10, rating: 5, image: '/assets/RCP-024.webp' }
      ]
    },
    {
      id: 5,
      name: 'Soups',
      items: [
        { id: 501, name: 'Classic Bean Soup', price: 26.10, rating: 5, image: '/assets/RCP-027.jpg' },
        { id: 502, name: 'Tofu Soup with Spinach', price: 26.10, rating: 5, image: '/assets/RCP-028.webp' },
        { id: 503, name: 'Carrot Soup', price: 26.10, rating: 5, image: '/assets/RCP-029.webp' },
        { id: 504, name: 'Classic Tomato Soup', price: 26.10, rating: 5, image: '/assets/RCP-030.webp' }
      ]
    },
    {
      id: 6,
      name: 'Side Dishes',
      items: [
        { id: 601, name: 'Lettuce Wrap', price: 26.10, rating: 5, image: '/assets/RCP-006.webp' },
        { id: 602, name: 'Pan Seared Scallops', price: 26.10, rating: 5, image: '/assets/RCP-026.webp' },
        { id: 603, name: 'Garlic Butter Salmon', price: 26.10, rating: 5, image: '/assets/RCP-031.jpg' }
      ]
    }
  ];

  const filters = [
    { id: 'calories', name: 'Calories', options: ['< 300', '300 - 500', '> 500'] },
    { id: 'protein', name: 'Main Protein', options: ['Salmon', 'Tuna', 'Chicken', 'Shirmp', 'Scallop', 'Tofu'] }
  ];

  const addToCart = (item) => {
    if (propAuthStatus === 'guest') {
      setTempItemToAdd(item);
      setShowAuthModal(true);
    } else {
      const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
      if (existingItemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += 1;
        setCart(updatedCart);
      } else {
        setCart([...cart, { ...item, quantity: 1, note: '' }]);
      }
    }
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const increaseQuantity = (index) => {
    const newCart = [...cart];
    newCart[index].quantity += 1;
    setCart(newCart);
  };

  const decreaseQuantity = (index) => {
    const newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
      setCart(newCart);
    } else {
      removeFromCart(index);
    }
  };

  const updateNote = (index, note) => {
    const newCart = [...cart];
    newCart[index].note = note;
    setCart(newCart);
  };

  const handleSignIn = () => {
    setShowAuthModal(false);
    setShowSignInForm(true);
  };

  const handleCreateAccount = () => {
    setShowAuthModal(false);
    setShowCreateAccountForm(true);
  };

  const handleNavSignInClick = () => {
    if (propAuthStatus !== 'signedIn') {
      setShowAuthModal(true);
    }
  };

  const handleContinueAsGuest = () => {
    setShowAuthModal(false);
    setPropAuthStatus('guest');
    if (tempItemToAdd) {
      const existingItemIndex = cart.findIndex(cartItem => cartItem.id === tempItemToAdd.id);
      if (existingItemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += 1;
        setCart(updatedCart);
      } else {
        setCart([...cart, { ...tempItemToAdd, quantity: 1, note: '' }]);
      }
      setTempItemToAdd(null);
    }
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setPropAuthStatus('signedIn');
    localStorage.setItem('authStatus', 'signedIn');
    setShowSignInForm(false);
    setUserEmail('');
    setUserPassword('');
  };

  const handleCreateAccountSubmit = (e) => {
    e.preventDefault();
    setPropAuthStatus('signedIn');
    localStorage.setItem('authStatus', 'signedIn');
    setShowCreateAccountForm(false);
    const newAddress = {
      ward,
      district,
      street,
      houseNumber,
      buildingName,
      block,
      floor,
      roomNumber,
      deliveryInstructions,
      fullName: `${firstName} ${lastName}`,
      contactMobile
    };
    setUserAddress(newAddress);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    if (propAuthStatus === 'guest') {
      navigate('/delivery');
    } else {
      navigate('/checkout');
    }
  };

  const renderFilterOptions = (filter) => {
    const isOpen = filtersOpen[filter.id] !== false;
    return (
      <div className="filter-block">
        <div className="filter-header">
          <h4>{filter.name}</h4>
          <span 
            className={`filter-toggle ${isOpen ? 'open' : 'closed'}`}
            onClick={() => toggleFilter(filter.id)}
          >
            ▼
          </span>
        </div>
        {isOpen && (
          <div className="filter-options">
            {filter.options.map((option, index) => (
              <div className="filter-option" key={index}>
                <input type="radio" id={`${filter.id}-${index}`} name={filter.id} />
                <label htmlFor={`${filter.id}-${index}`}>{option}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCategoryItems = (items) => {
    return (
      <div className="category-items">
        {items.map(item => {
          const imgPath = item.image;
          const recipeIdMatch = imgPath.match(/\/assets\/(RCP-\d+)\./);
          const recipeId = recipeIdMatch ? recipeIdMatch[1] : null;
          return (
            <div className="food-item" key={item.id}>
              <img src={item.image} alt={item.name} className="food-image" />
              <div className="food-details">
                <h4>{item.name}</h4>
                <div className="rating">
                  {Array(5).fill().map((_, i) => (
                    <span key={i} className={i < item.rating ? "star filled" : "star"}>★</span>
                  ))}
                </div>
                <div className="food-actions">
                  <span className="price">${item.price.toFixed(2)}</span>
                  <button className="add-to-cart" onClick={() => addToCart(item)}>Add to cart</button>
                </div>
                {recipeId && recipeDetails[recipeId] && (
                  <div 
                    className="show-more"
                    onClick={() => showRecipeDetails(recipeId)}
                  >
                    Show more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="menu-page">
      <div className="navbar menu-navbar">
        <div className={`menu-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <div className="mobile-logo">
          <img src="/assets/logo.png" alt="Logo" className="logo" />
        </div>
        <div
          className={`overlay ${menuOpen ? 'active' : ''}`}
          ref={overlayRef}
          onClick={toggleMenu}
        ></div>
        <div className={`nav-links ${menuOpen ? 'active' : ''}`} ref={navRef}>
          <div className="close-btn" onClick={toggleMenu}>✕</div>
          <a href="#">Menu</a>
          <a href="#">Discount</a>
          <img src="/assets/logo.png" alt="Logo" className="logo" />
          <span className="nav-link" onClick={handleAccountClick} style={{ cursor: 'pointer' }}>
            Account
          </span>
          <a href="#">Support</a>
        </div>
      </div>

      <div className="user-nav">
        <div className="user-nav-container">
          <div className="user-nav-left">
            <span className="user-icon">👤</span>
            {propAuthStatus === 'signedIn' ? (
              <span className="user-nav-item">User</span>
            ) : (
              <span className="user-nav-item" onClick={handleNavSignInClick}>Sign In</span>
            )}
            <span className="separator">|</span>
            <span className="user-nav-item">Guest Order</span>
            <span className="separator">|</span>
            <span className="user-nav-item">Track Your Order</span>
          </div>
        </div>
      </div>

      <div className="menu-container">
        <div className="sidebar">
          <h3>Menu</h3>
          <div className="filters">
            {filters.map(filter => (
              <div className="filter" key={filter.id}>
                {renderFilterOptions(filter)}
              </div>
            ))}
          </div>
        </div>
        
        <div className="menu-content">
          {categories.map(category => {
            const isCategoryOpen = categoriesOpen[category.id] !== false;
            return (
              <div className="category" key={category.id}>
                <div 
                  className="category-header"
                  onClick={() => toggleCategory(category.id)}
                >
                  <h3>{category.name}</h3>
                  <span className={`toggle-icon ${isCategoryOpen ? 'open' : 'closed'}`}>▼</span>
                </div>
                {isCategoryOpen && renderCategoryItems(category.items)}
              </div>
            );
          })}
        </div>
        
        <div className="cart-section">
          <h3>My Order</h3>
          <div className="cart-items">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div className="cart-item" key={index}>
                  <div className="cart-item-content">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-header">
                        <h4>{item.name}</h4>
                        <div className="item-quantity-controls">
                          <span className="quantity-btn" onClick={() => decreaseQuantity(index)}>-</span>
                          <span className="quantity">{item.quantity}</span>
                          <span className="quantity-btn" onClick={() => increaseQuantity(index)}>+</span>
                          <span className="remove-btn" onClick={() => removeFromCart(index)}>🗑️</span>
                        </div>
                      </div>
                      <div className="cart-item-footer">
                        <div className="note-section">
                          <div className="note-label">Note:</div>
                          <input 
                            type="text" 
                            className="note-input" 
                            placeholder="Note something for store" 
                            value={item.note || ''}
                            onChange={(e) => updateNote(index, e.target.value)}
                          />
                        </div>
                        <div className="cart-item-price">{item.price.toFixed(2)}$</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-cart">Your cart is empty</div>
            )}
          </div>
          {cart.length > 0 && (
            <div className="cart-total">
              <span>Total:</span>
              <span>${calculateTotal()}</span>
            </div>
          )}
          <button 
            className="checkout-btn" 
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Check Out
          </button>
        </div>
      </div>
      
      {showAuthModal && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <h3>Sign in to Greedible and start Green today</h3>
            <div className="auth-options">
              <button className="auth-option-btn sign-in-btn" onClick={handleSignIn}>
                SIGN IN
              </button>
              <div className="auth-separator"></div>
              <button className="auth-option-btn create-account-btn" onClick={handleCreateAccount}>
                CREATE AN ACCOUNT
                <span className="account-time">in less than 2 minutes</span>
                <span className="account-benefits">To enjoy member benefits</span>
              </button>
              <div className="auth-separator"></div>
              <button className="auth-option-btn guest-btn" onClick={handleContinueAsGuest}>
                CONTINUE AS GUEST
              </button>
            </div>
          </div>
        </div>
      )}

      {showSignInForm && (
        <div className="auth-modal-overlay">
          <div className="auth-form-modal">
            <h3>Sign In</h3>
            <button className="close-modal-btn" onClick={() => setShowSignInForm(false)}>✕</button>
            <form onSubmit={handleSignInSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={userPassword} 
                  onChange={(e) => setUserPassword(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>
              <button type="submit" className="form-submit-btn">SIGN IN</button>
            </form>
          </div>
        </div>
      )}

      {showCreateAccountForm && (
        <div className="auth-modal-overlay">
          <div className="auth-form-modal register-form">
            <h3>Create New Account</h3>
            <button className="close-modal-btn" onClick={() => setShowCreateAccountForm(false)}>✕</button>
            <form onSubmit={handleCreateAccountSubmit}>
              <div className="form-section">
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={userEmail} 
                    onChange={(e) => setUserEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    value={userPassword} 
                    onChange={(e) => setUserPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div className="form-section">
                <h4>About you</h4>
                <div className="form-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Contact Mobile</label>
                  <input 
                    type="tel" 
                    value={contactMobile} 
                    onChange={(e) => setContactMobile(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div className="form-section" style={{maxHeight: '300px', overflowY: 'auto'}}>
                <h4>Your Address</h4>
                <div className="delivery-row">
                  <div className="delivery-field">
                    <label>*Ward:</label>
                    <div className="custom-select">
                      <div 
                        className="select-header" 
                        onClick={() => setWardDropdownOpen(!wardDropdownOpen)}
                      >
                        {ward || "We only deliver to the wards in this list"}
                        <span className="dropdown-arrow">▼</span>
                      </div>
                      {wardDropdownOpen && (
                        <div className="select-options">
                          {wards.map((item, index) => (
                            <div 
                              key={index} 
                              className="select-option" 
                              onClick={() => {
                                setWard(item);
                                setWardDropdownOpen(false);
                              }}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="delivery-field">
                    <label>*District:</label>
                    <div className="custom-select">
                      <div 
                        className="select-header" 
                        onClick={() => setDistrictDropdownOpen(!districtDropdownOpen)}
                      >
                        {district || "We only deliver to the districts in this list"}
                        <span className="dropdown-arrow">▼</span>
                      </div>
                      {districtDropdownOpen && (
                        <div className="select-options">
                          {districts.map((item, index) => (
                            <div 
                              key={index} 
                              className="select-option" 
                              onClick={() => {
                                setDistrict(item);
                                setDistrictDropdownOpen(false);
                              }}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="delivery-row">
                  <div className="delivery-field">
                    <label>*Street:</label>
                    <div className="custom-select">
                      <div 
                        className="select-header" 
                        onClick={() => setStreetDropdownOpen(!streetDropdownOpen)}
                      >
                        {street || "We only deliver to the streets in this list"}
                        <span className="dropdown-arrow">▼</span>
                      </div>
                      {streetDropdownOpen && (
                        <div className="select-options">
                          {streets.map((item, index) => (
                            <div 
                              key={index} 
                              className="select-option" 
                              onClick={() => {
                                setStreet(item);
                                setStreetDropdownOpen(false);
                              }}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="delivery-field">
                    <label>*House/Street Number:</label>
                    <input 
                      type="text" 
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="delivery-field single-row">
                  <label>Building Name:</label>
                  <input 
                    type="text" 
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                  />
                </div>
                <div className="delivery-row three-column">
                  <div className="delivery-field">
                    <label>Block:</label>
                    <input 
                      type="text" 
                      value={block}
                      onChange={(e) => setBlock(e.target.value)}
                    />
                  </div>
                  <div className="delivery-field">
                    <label>Floor / Level:</label>
                    <input 
                      type="text" 
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                    />
                  </div>
                  <div className="delivery-field">
                    <label>Room Number / Company Name:</label>
                    <input 
                      type="text" 
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="delivery-field single-row">
                  <label>Delivery Instruction to Rider:</label>
                  <textarea 
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <button type="submit" className="form-submit-btn">Confirm</button>
            </form>
          </div>
        </div>
      )}

      {showDetailPopup && selectedRecipe && recipeDetails[selectedRecipe] && (
        <div className="detail-popup-overlay" onClick={closeDetailPopup}>
          <div className="detail-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup-btn" onClick={closeDetailPopup}>✕</button>
            <div className="detail-popup-content">
              <div className="detail-popup-image">
                <img 
                  src={`/assets/${selectedRecipe}.jpg`}
                  alt={recipeDetails[selectedRecipe].name}
                  onError={(e) => {
                    if (e.target.src.includes('.jpg')) {
                      e.target.src = `/assets/${selectedRecipe}.webp`;
                    }
                  }}
                />
              </div>
              <div className="detail-popup-info">
                <h3>{recipeDetails[selectedRecipe].name}</h3>
                <p className="detail-description">
                  {recipeDetails[selectedRecipe].description}
                </p>
                <ul className="nutrition-list">
                  <li><strong>Calories:</strong> {recipeDetails[selectedRecipe].calories}</li>
                  <li><strong>Protein:</strong> {recipeDetails[selectedRecipe].protein}g</li>
                  <li><strong>Fat:</strong> {recipeDetails[selectedRecipe].fat}g</li>
                  <li><strong>Fiber:</strong> {recipeDetails[selectedRecipe].fiber}g</li>
                  <li><strong>Carb:</strong> {recipeDetails[selectedRecipe].carb}g</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuPage;