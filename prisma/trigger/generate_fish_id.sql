DELIMITER //

CREATE TRIGGER generate_fish_id_trigger
BEFORE INSERT ON fish
FOR EACH ROW
BEGIN
    DECLARE last_number INT;
    DECLARE new_id VARCHAR(10);

    -- Get the last number used in the fish ID
    SELECT MAX(CAST(SUBSTRING_INDEX(id_fish, '-', -1) AS UNSIGNED))
    INTO last_number
    FROM fish;

    -- Increment the last number and format the new ID
    SET new_id = CONCAT('FSH-', LPAD(last_number + 1, 3, '0'));

    -- Set the new ID for the new fish entry
    SET NEW.id_fish = new_id;
END;
//

DELIMITER ;
