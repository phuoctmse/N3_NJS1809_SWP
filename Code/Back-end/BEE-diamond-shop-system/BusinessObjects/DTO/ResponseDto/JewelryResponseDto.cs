namespace BusinessObjects.DTO.ResponseDto;

public class JewelryResponseDto
{
    public int JewelryId { get; set; }
    public string? Name { get; set; }
    public string? Type { get; set; }
    public string? Barcode { get; set; }
    public decimal? LaborCost { get; set; }
    public decimal JewelryPrice { get; set; }
    public int? JewelryTypeId { get; set; }
    public string? Code { get; set; }
    public bool? IsSold { get; set; }
    public string? PreviewImage { get; set; }
    public int? WarrantyTime { get; set; }
    public IList<Materials>? Materials { get; set; }
    public decimal TotalPrice { get; set; }
}