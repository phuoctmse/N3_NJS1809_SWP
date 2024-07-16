namespace BusinessObjects.DTO.Jewelry;

public class JewelryMaterialRequestDto
{
    public int GemId { get; set; }
    public int GoldId { get; set; }

    public decimal GoldWeight { get; set; }
    public decimal GemQuantity { get; set; }

    public int JewelryMaterialId { get; set; }
}