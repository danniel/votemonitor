import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useLanguages } from '@/features/languages/queries';
import { Button } from '@/components/ui/button';
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";

export interface LanguageSelectProps {
    languageCode: string;
    onSelect: (value: string) => void;
}

function LanguageSelect({ languageCode, onSelect }: LanguageSelectProps) {
    const { data: languages } = useLanguages();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(languageCode);
    const { t } = useTranslation();

    const placeholder = useMemo(()=>{
        if(value && languages?.length){
          const language =   languages?.find((l) => l.code === value);

          return `${language?.name} / ${language?.nativeName}`;
        }

        return t('containers.languageSelect.placeholder');
    },[languages,value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[350px] justify-between"
                >
                    {placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-0">
                <Command filter={(value, search, keywords) => {
                    const extendValue = value + ' ' + keywords?.join(' ');
                    if (extendValue.toLocaleLowerCase().includes(search.toLocaleLowerCase())) return 1
                    return 0
                }}>
                    <CommandInput placeholder={ t('containers.languageSelect.searchPlaceholder')} />
                    <CommandEmpty>{t('containers.languageSelect.noResults')}</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {languages?.map((language) => (
                                <CommandItem
                                    key={language.code}
                                    value={language.code}
                                    keywords={[language.code, language.name, language.nativeName]}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue);
                                        setOpen(false);
                                        onSelect(currentValue);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === language.code ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {language.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default LanguageSelect;
