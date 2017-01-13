SELECT * FROM bamazon.inventory;

INSERT INTO bamazon.inventory(ProductName, DepartmentName, Price, StockQuantity) VALUES ('Red', 'Home', 13, 4);

DELETE FROM bamazon.inventory WHERE ProductName = "Red";
