
// Update the field name to match the schema
<FormField
  control={form.control}
  name="loai_doi_tuong"  // Changed from doi_tuong_lien_quan to loai_doi_tuong
  render={({ field }) => (
    <FormItem>
      <FormLabel>Loại đối tượng</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại đối tượng" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="hoc_sinh">Học sinh</SelectItem>
          <SelectItem value="nhan_vien">Nhân viên</SelectItem>
          <SelectItem value="co_so">Cơ sở</SelectItem>
          <SelectItem value="csvc">Cơ sở vật chất</SelectItem>
          <SelectItem value="lien_he">Liên hệ</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
