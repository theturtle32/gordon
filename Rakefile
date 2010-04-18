src_dir = 'src'
vendor_dir = 'vendor'
dist_dir = 'dist'
build_dir = 'build'
base_names = [
  'base',
  'object_utils',
  'movie',
  'parser',
  'stream',
  'svg_renderer',
  'vendor',
  'abc/abc_stream',
  'abc/abc_file',
  'abc/abc_parser',
  'abc/abc_constant_pool',
  'abc/abc_method_signature',
  'abc/abc_namespace',
  'abc/abc_namespace_set',
  'abc/abc_multiname',
  'abc/abc_metadata',
  'abc/abc_instance',
  'abc/abc_class',
  'abc/abc_trait',
  'abc/abc_script',
  'abc/abc_method_body',
  'abc/abc_exception',
  'abc/abc_instructions'
]
base_files = base_names.map { |file| File.join(src_dir, file + '.js') }
intro = File.join(src_dir, 'intro.js')
outro = File.join(src_dir, 'outro.js')
vendor = File.join(src_dir, 'vendor.js')
output_file = File.join(dist_dir, 'gordon.js')
output_file_min = File.join(dist_dir, 'gordon.min.js')
compiler = File.join(build_dir, 'compiler.jar')

task :default => :min

task :gordon do
  sh 'cat ' + File.join(vendor_dir, '*') + ' > ' + vendor
  sh 'mkdir -p ' + dist_dir
  sh 'cat ' + intro + ' > ' + output_file
  sh 'for file in ' + base_files.join(' ') + "; do echo | cat $file - | sed 's/^/\t/' >> " + output_file + '; done'
  sh 'cat ' + outro + ' >> ' + output_file
end

task :min => :gordon do
  sh 'head -6 ' + output_file + ' > ' + output_file_min
  sh 'java -jar ' + compiler + ' --warning_level QUIET --js=' + output_file + ' >> ' + output_file_min
end

task :clean do
  sh 'rm -rf ' + dist_dir
  sh 'rm ' + vendor
end
