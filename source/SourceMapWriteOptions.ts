export interface WriteMapper {
	(file: string): string;
}

export interface SourceMapWriteOptions {
	addComment?: boolean;
	includeContent?: boolean;
	sourceRoot?: string | WriteMapper;
	sourceMappingURLPrefix?: string | WriteMapper;
}/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

export default SourceMapWriteOptions;