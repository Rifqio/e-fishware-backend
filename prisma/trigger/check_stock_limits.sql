DELIMITER //

CREATE TRIGGER check_stock_limits_trigger
BEFORE INSERT ON fish_stock_transaction
FOR EACH ROW
BEGIN
    DECLARE quantity INT;
    DECLARE min_stock INT;
    DECLARE max_stock INT;

    -- Fetch the current stock and limits for the fish
    SELECT f.quantity, f.min_stock, f.max_stock
    INTO quantity, min_stock, max_stock
    FROM fish f
    WHERE f.id_fish = NEW.fish_id;

    -- Check if the transaction type is 'IN' or 'OUT'
    IF NEW.transaction_type = 'IN' THEN
        -- Check if the new stock exceeds the maximum limit
        IF quantity + NEW.quantity > max_stock THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Stock exceeds maximum limit';
        END IF;
    ELSEIF NEW.transaction_type = 'OUT' THEN
        -- Check if the new stock falls below the minimum limit
        IF quantity - NEW.quantity < min_stock THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Stock falls below minimum limit';
        END IF;
    END IF;
END;
//

DELIMITER ;
