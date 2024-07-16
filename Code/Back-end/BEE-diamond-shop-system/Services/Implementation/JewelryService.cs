using BusinessObjects.DTO.Jewelry;
using BusinessObjects.DTO.ResponseDto;
using BusinessObjects.Models;
using BusinessObjects.Utils;
using Domain.Constants;
using Repositories.Interface;
using Services.Interface;
using Tools;

namespace Services.Implementation
{
    public class JewelryService(
        IJewelryRepository jewelryRepository,
        IJewelryMaterialRepository jewelryMaterialRepository) : IJewelryService
    {
        private IJewelryRepository JewelryRepository { get; } = jewelryRepository;
        public IJewelryMaterialRepository JewelryMaterialRepository { get; } = jewelryMaterialRepository;

        public async Task<IEnumerable<JewelryResponseDto?>?> GetJewelries()
        {
            var jewelries = await JewelryRepository.Gets();
            return jewelries;
        }

        public async Task<JewelryResponseDto?> GetJewelryById(int id)
        {
            var jewelryResponseDto = await JewelryRepository.GetById(id);
            return jewelryResponseDto;
        }


        public async Task<int> CreateJewelry(JewelryRequestDto jewelryRequestDto)
        {
            // Create Jewelry first before creating JewelryMaterial
            var jewelry = new Jewelry
            {
                Code = jewelryRequestDto.Code,
                Name = jewelryRequestDto.Name,
                JewelryTypeId = jewelryRequestDto.JewelryTypeId,
                Barcode = jewelryRequestDto.Barcode,
                LaborCost = jewelryRequestDto.LaborCost,
                PreviewImage = jewelryRequestDto.PreviewImage,
                WarrantyTime = jewelryRequestDto?.WarrantyTime,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                IsSold = false
            };
            try
            {
                await JewelryRepository.Create(jewelry);
                FileUtil.SaveTempToReal(jewelry.PreviewImage, EnumFileType.Jewellery);
            }
            catch (Exception)
            {
                throw new CustomException.InvalidDataException("Failed to create Jewelry.");
            }

            // Create JewelryMaterial
            var jewelryMaterial = new JewelryMaterial
            {
                JewelryId = jewelry.JewelryId,
                GoldId = jewelryRequestDto.JewelryMaterial.GoldId,
                GemId = jewelryRequestDto.JewelryMaterial.GemId,
                GoldWeight = jewelryRequestDto.JewelryMaterial.GoldWeight,
                StoneQuantity = jewelryRequestDto.JewelryMaterial.GemQuantity
            };
            try
            {
                await JewelryMaterialRepository.Create(jewelryMaterial);
                return 1;
            }
            catch (Exception e)
            {
                await JewelryRepository.Delete(jewelry.JewelryId);
                throw new CustomException.InvalidDataException("Failed to create JewelryMaterial.");
            }
        }

        public async Task<int> DeleteJewelry(int id)
        {
            return await JewelryRepository.Delete(id);
        }

        public async Task<int> UpdateJewelry(int id, Jewelry jewelry)
        {
            return await JewelryRepository.Update(id, jewelry);
        }
    }
}