﻿namespace BusinessObjects.DTO.Bill;

public class BillItemRequestDto
{
    public int JewelryId { get; set; }
    public int Quantity { get; set; }
    public decimal GemQuantity { get; set; }
    public decimal GoldWeight { get; set; }
}