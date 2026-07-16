import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import type { LabelValue } from "./common-interfaces"
import { Spinner } from "../ui/spinner"

interface UserStatusBadgeProps {
  options: LabelValue[]
  handleRestSearch: (inputValue: string) => void
  setRestaurantId: (inputValue: string | undefined) => void
  setRestaurantName: (inputValue: string) => void
  restaurantName: string
  isLoading: boolean
}

export const RestaurantCombobox = ({
  options,
  handleRestSearch,
  setRestaurantId,
  restaurantName,
  setRestaurantName,
  isLoading,
}: UserStatusBadgeProps) => {
  return (
    <Combobox
      items={options}
      itemToStringValue={(item: LabelValue) => item.label}
      onInputValueChange={(value) => handleRestSearch(value)}
      onValueChange={(option) => {
        const { label, value } = option ?? {}
        setRestaurantId(value)
        setRestaurantName(label ?? "")
      }}
    >
      <ComboboxInput
        placeholder="Buscar restaurante..."
        showClear
        value={restaurantName}
      />
      <ComboboxContent>
        {isLoading ? (
          <div className="flex items-center gap-2 px-3 py-4 text-sm text-muted-foreground">
            <Spinner data-icon="inline-start" />
            Carregando...
          </div>
        ) : (
          <>
            <ComboboxEmpty>Nenhum Restaurante Encontrado</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </>
        )}
      </ComboboxContent>
    </Combobox>
  )
}
