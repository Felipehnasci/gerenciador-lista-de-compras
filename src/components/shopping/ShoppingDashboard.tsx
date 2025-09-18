import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ShoppingCart, LogOut, CheckCircle, Circle, Trash2 } from "lucide-react";
import { ShoppingListDialog } from "./ShoppingListDialog";
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

interface ShoppingDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export const ShoppingDashboard = ({ userEmail, onLogout }: ShoppingDashboardProps) => {
  const [lists, setLists] = useState<ShoppingList[]>([
    {
      id: "1",
      name: "Compras da Semana",
      items: [
        { id: "1", name: "Leite", category: "Laticínios", completed: false },
        { id: "2", name: "Pão", category: "Padaria", completed: true },
        { id: "3", name: "Ovos", category: "Laticínios", completed: false },
      ],
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2", 
      name: "Festa de Aniversário",
      items: [
        { id: "4", name: "Refrigerante", category: "Bebidas", completed: false },
        { id: "5", name: "Salgadinhos", category: "Snacks", completed: false },
      ],
      createdAt: new Date("2024-01-14"),
    },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const { toast } = useToast();

  const handleCreateList = (name: string, items: { name: string; category: string }[]) => {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name,
      items: items.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        name: item.name,
        category: item.category,
        completed: false,
      })),
      createdAt: new Date(),
    };
    
    setLists([newList, ...lists]);
    toast({
      title: "Lista criada!",
      description: `A lista "${name}" foi criada com sucesso.`,
    });
  };

  const handleEditList = (updatedList: ShoppingList) => {
    setLists(lists.map(list => list.id === updatedList.id ? updatedList : list));
    toast({
      title: "Lista atualizada!",
      description: `A lista "${updatedList.name}" foi atualizada.`,
    });
  };

  const handleDeleteList = (listId: string) => {
    const listToDelete = lists.find(list => list.id === listId);
    setLists(lists.filter(list => list.id !== listId));
    toast({
      title: "Lista excluída",
      description: `A lista "${listToDelete?.name}" foi excluída.`,
    });
  };

  const toggleItemCompleted = (listId: string, itemId: string) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        };
      }
      return list;
    }));
  };

  const getListProgress = (list: ShoppingList) => {
    const completedItems = list.items.filter(item => item.completed).length;
    const totalItems = list.items.length;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const openListDialog = (list?: ShoppingList) => {
    setSelectedList(list || null);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-card shadow-soft border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Lista de Compras</h1>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            </div>
          </div>
          
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Suas Listas</h2>
            <p className="text-muted-foreground">
              Gerencie suas listas de compras de forma organizada
            </p>
          </div>
          
          <Button 
            onClick={() => openListDialog()}
            className="gap-2 bg-gradient-primary hover:bg-primary-hover h-12 px-6"
          >
            <Plus className="w-5 h-5" />
            Nova Lista
          </Button>
        </div>

        {/* Shopping Lists Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => {
            const progress = getListProgress(list);
            const completedItems = list.items.filter(item => item.completed).length;
            
            return (
              <Card 
                key={list.id} 
                className="shadow-medium hover:shadow-strong transition-smooth cursor-pointer bg-gradient-card border-0"
                onClick={() => openListDialog(list)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg truncate">{list.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteList(list.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    {completedItems}/{list.items.length} itens concluídos
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-smooth" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="space-y-2">
                    {list.items.slice(0, 3).map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center gap-2 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleItemCompleted(list.id, item.id);
                        }}
                      >
                        {item.completed ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                          {item.name}
                        </span>
                        <Badge variant="secondary" className="text-xs ml-auto">
                          {item.category}
                        </Badge>
                      </div>
                    ))}
                    {list.items.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{list.items.length - 3} itens a mais
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {lists.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma lista ainda</h3>
            <p className="text-muted-foreground mb-6">
              Crie sua primeira lista de compras para começar
            </p>
            <Button onClick={() => openListDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Criar primeira lista
            </Button>
          </div>
        )}
      </main>

      {/* Shopping List Dialog */}
      <ShoppingListDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        list={selectedList}
        onSave={selectedList ? handleEditList : handleCreateList}
      />
    </div>
  );
};