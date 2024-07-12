import "./Checkbox.css";

const Checkboxlist = ({ options, selectedOptions, setSelectedOptions }) => {
    const handleCategoryInputChange = (event, id) => {
        let checkboxValue = id;
        let newCategoryArray = [...selectedOptions];
        if (event.target.checked) {
            newCategoryArray.push(checkboxValue);
        } else {
            newCategoryArray = newCategoryArray.filter(
                (interest) => interest !== checkboxValue
            );
        }
        setSelectedOptions(newCategoryArray);
    };
    return (
        <>
            {options.map((category, index) => {
                return (
                    <label className="form-group" key={index}>
                        {category.name}
                        <input
                            onChange={(event) => {
                                handleCategoryInputChange(event, category.id);
                            }}
                            type="checkbox"
                        />
                        <span className="checkmark"></span>
                    </label>
                );
            })}
        </>
    );
};

export default Checkboxlist;
