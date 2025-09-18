import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, CheckCircle, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  completed: boolean;
}

interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: Date;
}

interface ShoppingListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  list?: ShoppingList | null;
  onSave: (list: ShoppingList | string, items?: { name: string; category: string }[]) => void;
}

const CATEGORIES = [
  "Laticínios",
  "Padaria",
  "Carnes",
  "Verduras",
  "Frutas",
  "Bebidas",
  "Higiene",
  "Limpeza",
  "Snacks",
  "Congelados",
  "Outros"
];

export const ShoppingListDialog = ({ open, onOpenChange, list, onSave }: ShoppingListDialogProps) => {
  const [listName, setListName] = useState("");
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (list) {
      setListName(list.name);
      setItems(list.items);
    } else {
      setListName("");
      setItems([]);
    }
  }, [list]);

  const handleAddItem = () => {
    if (!newItemName.trim() || !newItemCategory) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome do item e selecione uma categoria.",
        variant: "destructive",
      });
      return;
    }

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      category: newItemCategory,
      completed: false,
    };

    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemCategory("");
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleToggleItem = (itemId: string) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleSave = () => {
    if (!listName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para a lista.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Items necessários",
        description: "Adicione pelo menos um item à lista.",
        variant: "destructive",
      });
      return;
    }

    if (list) {
      // Editando lista existente
      const updatedList: ShoppingList = {
        ...list,
        name: listName.trim(),
        items,
      };
      onSave(updatedList);
    } else {
      // Criando nova lista
      onSave(listName.trim(), items.map(item => ({ name: item.name, category: item.category })));
    }

    onOpenChange(false);
    setListName("");
    setItems([]);
    setNewItemName("");
    setNewItemCategory("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {list ? "Editar Lista" : "Nova Lista de Compras"}
          </DialogTitle>
          <DialogDescription>
            {list ? "Modifique sua lista de compras" : "Crie uma nova lista de compras organizada por categorias"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* List Name */}
          <div className="space-y-2">
            <Label htmlFor="listName">Nome da Lista</Label>
            <Input
              id="listName"
              placeholder="Ex: Compras da semana"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Add New Item */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium">Adicionar Item</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <Input
                  placeholder="Nome do item"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-10"
                />
              </div>
              <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddItem} className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Item
            </Button>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                Itens da Lista ({items.length})
              </h4>
              {items.length > 0 && (
                <Badge variant="secondary">
                  {items.filter(item => item.completed).length} concluídos
                </Badge>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-3 p-3 bg-card rounded-lg border"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto"
                    onClick={() => handleToggleItem(item.id)}
                  >
                    {item.completed ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </Button>
                  
                  <div className="flex-1">
                    <span className={`font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                      {item.name}
                    </span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {items.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum item adicionado ainda</p>
                <p className="text-sm">Adicione itens usando o formulário acima</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-primary hover:bg-primary-hover"
              disabled={!listName.trim() || items.length === 0}
            >
              {list ? "Salvar Alterações" : "Criar Lista"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};