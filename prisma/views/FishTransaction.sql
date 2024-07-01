select
    `fish_stock_transaction`.`id_fish_stock_transaction` AS `id_fish_stock_transaction`,
    `fish_stock`.`id_fish_stock` AS `id_fish_stock`,
    `fish_stock`.`fish_type` AS `fish_type`,
    `fish_stock_transaction`.`transaction_type` AS `transaction_type`,
    `warehouse`.`id_warehouse` AS `warehouse_id`,
    `warehouse`.`name` AS `warehouse_name`,
    `fish_stock_transaction`.`created_at` AS `created_at`,
    `fish_stock_transaction`.`updated_at` AS `updated_at`,
    `fish_stock_transaction`.`price` AS `price`,
    `fish_stock_transaction`.`quantity` AS `quantity`,
    `users`.`full_name` AS `updated_by`
from
    (
        (
            (
                `fish_stock_transaction`
                join `fish_stock` on(
                    (
                        `fish_stock_transaction`.`fish_stock_id` = `fish_stock`.`id_fish_stock`
                    )
                )
            )
            join `warehouse` on(
                (
                    `fish_stock`.`warehouse_id` = `warehouse`.`id_warehouse`
                )
            )
        )
        join `users` on(
            (
                `fish_stock_transaction`.`updated_by` = `users`.`id_user`
            )
        )
    )