import { supabase } from './supabase';

export interface BrandIdentity {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
    styleMode: 'minimal' | 'glassmorphism' | 'brutalism' | 'corporate';
}

export const defaultBrandIdentity: BrandIdentity = {
    primaryColor: '#bef264', // The Noir Lime
    secondaryColor: '#171717',
    backgroundColor: '#0a0a0a',
    fontFamily: 'Inter',
    borderRadius: 'md',
    styleMode: 'glassmorphism'
};

export const brandService = {
    // Save brand settings to project
    async updateBrandIdentity(projectId: string, identity: BrandIdentity) {
        const { data, error } = await supabase
            .from('projects')
            .update({ brand_identity: identity })
            .eq('id', projectId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get brand settings
    async getBrandIdentity(projectId: string): Promise<BrandIdentity> {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('brand_identity')
                .eq('id', projectId)
                .maybeSingle();

            if (error || !data || !data.brand_identity) {
                return defaultBrandIdentity;
            }
            
            return { ...defaultBrandIdentity, ...data.brand_identity };
        } catch (err) {
            console.warn("Brand identity column might be missing, using defaults.");
            return defaultBrandIdentity;
        }
    },

    // Convert identity to AI Prompt instructions
    generateSystemPrompt(identity: BrandIdentity): string {
        return `
    === DESIGN SYSTEM GUIDELINES ===
    - DEFAULT PRIMARY COLOR: ${identity.primaryColor}
    - DEFAULT SECONDARY COLOR: ${identity.secondaryColor}
    - DEFAULT BACKGROUND: ${identity.backgroundColor}
    - FONT FAMILY: '${identity.fontFamily}'
    - BORDER RADIUS: ${identity.borderRadius === 'full' ? '9999px' : identity.borderRadius === 'none' ? '0px' : identity.borderRadius === 'lg' ? '1rem' : '0.5rem'}
    - VISUAL STYLE: ${identity.styleMode}
    
    CRITICAL: The colors above are the project's base theme. HOWEVER, if the user provides specific color instructions in their prompt (e.g., "Use Blue and White"), you MUST PRIORITIZE the user's requested colors over these defaults.
    ================================
    `;
    }
};
