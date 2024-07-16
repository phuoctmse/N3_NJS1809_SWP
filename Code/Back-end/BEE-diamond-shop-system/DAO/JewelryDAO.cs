using BusinessObjects.Context;
using BusinessObjects.Models;
using BusinessObjects.Utils;
using Domain.Constants;
using Microsoft.EntityFrameworkCore;

namespace DAO
{
    public class JewelryDao
    {
        private readonly JssatsContext _context;
        public JewelryDao()
        {
            _context = new JssatsContext();
        }
        public async Task<IEnumerable<Jewelry>> GetJewelries()
        {
            return await _context.Jewelries.ToListAsync();
        }

        public async Task<IEnumerable<Jewelry>> GetJewelriesDetails()
        {
            return await _context.Jewelries
                .Include(j => j.JewelryType)
                .Include(j => j.JewelryMaterials)
                    .ThenInclude(jm => jm.Gem)
                .Include(j => j.JewelryMaterials)
                    .ThenInclude(jm => jm.Gold)
                .ToListAsync();
        }

        public async Task<Jewelry?> GetJewelryById(int id)
        {
            var jewelry = await _context.Jewelries.FirstOrDefaultAsync(p => p.JewelryId == id);
            return jewelry;
        }

        public async Task<int> CreateJewelry(Jewelry jewelry)
        {
            // kiểm tra xem jewelry.Code đã tồn tại chưa
            var existingJewelry = await _context.Jewelries
                .FirstOrDefaultAsync(w => w.Code.Trim().ToLower() == jewelry.Code.Trim().ToLower());
            if (existingJewelry != null) return 0;
            _context.Jewelries.Add(jewelry);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> UpdateJewelry(int id, Jewelry jewelry)
        {
            // kiểm tra xem jewelry có tồn tại không
            var existingJewelry = await _context.Jewelries
                .FirstOrDefaultAsync(w => w.JewelryId == id);

            jewelry.JewelryId = id;
            if (existingJewelry == null) return 0;
            foreach (var material in jewelry.JewelryMaterials)
            {
                material.JewelryId = id;
            }

            // kiểm tra xem jewelry.Code đã tồn tại chưa
            var existingJewelryWithCode = await _context.Jewelries
                .FirstOrDefaultAsync(w => w.Code.Trim().ToLower() == jewelry.Code.Trim().ToLower() && w.JewelryId != id);

            if (existingJewelryWithCode != null) return 0;
            bool hasChangeImage = existingJewelry.PreviewImage != jewelry.PreviewImage;
            _context.Entry(existingJewelry).CurrentValues.SetValues(jewelry);
            existingJewelry.JewelryMaterials = jewelry.JewelryMaterials;
            _context.Entry(existingJewelry).State = EntityState.Modified;
            int result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                if (hasChangeImage)
                {
                    FileUtil.DeleteFile(existingJewelry.PreviewImage, EnumFileType.Jewellery);
                    FileUtil.SaveTempToReal(jewelry.PreviewImage, EnumFileType.Jewellery);
                }
                return result;
            }
            return 0;
        }

        public async Task<int> DeleteJewelry(int id)
        {
            var jewelry = await _context.Jewelries
                .Include(x => x.JewelryMaterials)
                .FirstOrDefaultAsync(x => x.JewelryId == id);

            if (jewelry != null)
            {
                // Remove related JewelryMaterials explicitly
                _context.JewelryMaterials.RemoveRange(jewelry.JewelryMaterials);

                // Now remove the Jewelry
                _context.Jewelries.Remove(jewelry);

                return await _context.SaveChangesAsync();
            }
            return 0;
        }

        public async Task<bool> IsSold(int id)
        {
            var jewelry = await _context.Jewelries.FindAsync(id);
            return jewelry?.IsSold ?? false;
        }
        public async Task<IEnumerable<Jewelry>> GetJewelriesByBillId(int billId)
        {
            return await _context.Jewelries
                .Where(j => j.BillJewelries.Any(bj => bj.BillId == billId))
                .ToListAsync();
        }
    }
}
