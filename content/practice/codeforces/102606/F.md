---
title: "CF 102606F - 查找/-type f -或-type d"
description: "输入描述文件系统快照。 每一行都是一个绝对路径，代表一个文件或一个目录，但这些行以随机顺序混合。"
date: "2026-08-04T17:03:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102606
codeforces_index: "F"
codeforces_contest_name: "2020 ECNU Campus Online Invitational Contest"
rating: 0
weight: 102606
solve_time_s: 66
verified: true
draft: false
---

[CF 102606F - 查找/-type f -或-type d](https://codeforces.com/problemset/problem/102606/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 输入描述文件系统快照。 每一行都是一个绝对路径，代表一个文件或一个目录，但这些行以随机顺序混合。 目录仅因为其中存在某个文件而出现，因此列表中的每个目录都是至少一个列出的文件的祖先。 任务是恢复列出的条目中有多少个名称以`.eoj`。 

困难在于输入并没有告诉我们哪些路径是文件，哪些是目录。 结束于的路径`.eoj`并不是自动有效的答案，因为目录也可以具有该后缀。 例如，`/a.eoj/b`证明`/a.eoj`是目录，不是文件。 

输入大小足够大，必须有效地处理每条路径。 路径可以有 100000 个，所有路径的字符总数最多为 1000000 个。这排除了比较每对路径的方法，因为这可能需要大约 10^10 次操作。 需要一种与总输入大小接近线性的方法。 

棘手的情况来自于混淆名称和文件类型。 考虑：```
1
/a.eoj
```答案是`1`因为下面没有孩子`/a.eoj`，因此该条目必须是一个文件。 

现在考虑：```
2
/a.eoj
/a.eoj/b
```答案是`0`。 一个粗心的解决方案，只检查后缀才算数`/a.eoj`，但第二条路径证明了`/a.eoj`是一个目录。 

另一种情况是：```
2
/a.eoj/b.eoj
/a.eoj
```答案是`1`。 路径`/a.eoj`是一个目录，即使它以`.eoj`， 尽管`/a.eoj/b.eoj`是一个文件。 

## 方法

 一个简单的解决方案是存储所有路径，并且对于每条以`.eoj`，搜索输入以检查另一个路径是否将其作为前缀，后跟斜杠。 如果存在这样的较长路径，则候选路径是目录。 这是正确的，因为每个目录必须至少有一个后代。 然而，对于 100000 条路径，这可能需要比较每对路径。 即使忽略字符串比较成本，这也会产生大约 10^10 次检查，这太慢了。 

关键的观察是我们不需要测试所有可能的祖先关系。 唯一需要的信息是路径是否有子路径。 当至少一个其他路径以该路径开头且后跟时，路径就是一个目录`/`。 

这就把问题变成了前缀问题。 如果我们将每个路径插入到 trie 中，则每个具有子节点的节点都代表一个目录。 每个叶节点代表一个没有后代的路径，它必须是一个文件。 然后我们只计算完整路径以`.eoj`。 

字典树自然适合，因为输入已经是分层的。 共享目录前缀存储一次，总工作量与字符总数成正比。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²L) | O(nL) | 太慢了|
 | 特里树 | O(S)| O(S)| 已接受 |

 这里，`L`是最大路径长度并且`S`是所有路径中的字符总数。 

## 算法演练

 1. 将每条路径拆分为其组件，并将组件插入到 trie 中。 每个 trie 边代表移动到一个目录或文件名组件。 

trie 存储隐藏在打乱列表中的父子关系。 输入顺序不再重要，因为路径在插入期间会自动连接到其祖先。 

1. 标记代表每个完整输入路径末端的节点。 

仅应计算与输入中的实际条目相对应的节点。 中间特里树节点可能仅存在，因为它们是较长路径的祖先。 

1.构建完成后遍历trie。 对于每个标记的节点，检查它是否有任何子节点。 

带有子节点的标记节点代表一个目录，因为另一个输入路径在其下方继续。 没有子节点的标记节点表示一个文件，因为它下面不存在任何内容。 

1. 对于每个标记的叶子节点，重建或存储其完整路径名，并检查最终组件是否以`.eoj`。 如果确实如此，请增加答案。 

后缀仅属于最终组件。 以以下结尾的目录名称`.eoj`被忽略，因为它不可能是叶子。 

为什么它有效：

 不变量是每个具有子节点的 trie 节点都对应于一条路径，该路径下方至少有一个较长的输入路径。 由于目录不能在其中没有文件的情况下存在，因此此类节点必须是目录。 相反，没有子节点的标记节点在输入中没有后代，因此它不能是目录，而必须是文件。 该算法精确计算具有所需扩展名的叶条目，该扩展名与答案的定义相匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Node:
    __slots__ = ("children", "terminal", "name")

    def __init__(self, name=""):
        self.children = {}
        self.terminal = False
        self.name = name

def solve():
    n = int(input())
    root = Node()

    for _ in range(n):
        path = input().strip()
        parts = path.split("/")[1:]
        cur = root
        for part in parts:
            if part not in cur.children:
                cur.children[part] = Node(part)
            cur = cur.children[part]
        cur.terminal = True

    ans = 0

    def dfs(node):
        nonlocal ans
        if node.terminal and not node.children and node.name.endswith(".eoj"):
            ans += 1
        for child in node.children.values():
            dfs(child)

    dfs(root)
    print(ans)

if __name__ == "__main__":
    solve()
```插入阶段为其父级下的每个唯一路径组件创建一个 trie 节点。 第一个组件插入到根目录下方，因为前导斜杠不是有意义的目录名称。 

这`terminal`标志将输入中实际出现的路径与仅作为祖先创建的节点分开。 这很重要，因为目录可以作为列出的条目出现，但中间节点本身并不代表答案中的文件或目录。 

在DFS期间，条件`not node.children`识别叶子。 仅在确认节点是文件候选后才应用后缀检查。 Python 整数具有任意精度，因此答案计数不需要溢出处理。 

## 工作示例

 对于第一个样本：```
/secret/eoj
/secret
/secret.eoj
```插入后的trie状态为：

 | 路径节点| 有孩子 | 终端| 计数|
 | --- | --- | --- | --- |
 | 秘密| 是的 | 是的 | 没有|
 | 秘密/EOJ | 没有| 是的 | 没有|
 | 秘密.eoj | 没有| 是的 | 是的 |

 目录`/secret`被拒绝，因为它有一个孩子。 该文件`/secret/eoj`没有所需的后缀。 仅有的`/secret.eoj`对答案有贡献，所以结果是`1`。 

对于第二个样本：```
/cuber.eoj/qq.eoj
/cuber.eoj
```特里状态是：

 | 路径节点| 有孩子 | 终端| 计数|
 | --- | --- | --- | --- |
 | 立方体.eoj | 是的 | 是的 | 没有|
 | cuber.eoj/qq.eoj | 没有| 是的 | 是的 |

 虽然`/cuber.eoj`结束于`.eoj`，它有一个子级并且是一个目录。 叶子`/cuber.eoj/qq.eoj`是唯一计算的文件，给出答案`1`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(S)| 每个字符插入一次，每个 trie 节点访问一次 |
 | 空间| O(S)| trie存储路径结构|

 总输入长度最多为 1000000 个字符，因此线性解决方案可以轻松满足约束条件。 trie避免了重复的前缀比较，直接使用文件系统结构。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.readline

    class Node:
        def __init__(self, name=""):
            self.children = {}
            self.terminal = False
            self.name = name

    n = int(data())
    root = Node()

    for _ in range(n):
        parts = data().strip().split("/")[1:]
        cur = root
        for p in parts:
            if p not in cur.children:
                cur.children[p] = Node(p)
            cur = cur.children[p]
        cur.terminal = True

    ans = 0

    def dfs(x):
        nonlocal ans
        if x.terminal and not x.children and x.name.endswith(".eoj"):
            ans += 1
        for y in x.children.values():
            dfs(y)

    dfs(root)
    sys.stdin = old
    return str(ans) + "\n"

assert run("""3
/secret/eoj
/secret
/secret.eoj
""") == "1\n", "sample 1"

assert run("""2
/cuber.eoj/qq.eoj
/cuber.eoj
""") == "1\n", "sample 2"

assert run("""1
/a.eoj
""") == "1\n", "single file"

assert run("""2
/a.eoj
/a.eoj/b
""") == "0\n", "directory with eoj suffix"

assert run("""4
/a.eoj/b.eoj
/a.eoj
/x
/y.eoj
""") == "2\n", "mixed files and directories"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`/a.eoj`|`1`| 单个后缀匹配文件 |
 |`/a.eoj`和`/a.eoj/b`|`0`| 名称结尾为的目录`.eoj`|
 | 混合树|`2`| 多个独立分支机构 |

 ## 边缘情况

 当目录的名称以以下结尾时，单独的后缀检查会失败`.eoj`。 

输入：```
2
/a.eoj
/a.eoj/b
```在 trie 构建过程中，`/a.eoj`获取子节点`b`。 DFS 认为`/a.eoj`不是叶子，所以不计算在内。 结果是`0`。 

具有后缀匹配祖先的嵌套文件不得影响祖先。 

输入：```
2
/a.eoj/b.eoj
/a.eoj
```trie 包含一个子元素`a.eoj`，以便该节点被视为目录。 节点为`b.eoj`没有孩子并且结束于`.eoj`，因此它贡献了一个计数。 输出是`1`。 

最短的有效输入仅包含一条路径。 

输入：```
1
/x
```特里树包含一个终端叶节点。 自从`x`不以`.eoj`，DFS 返回`0`。 这证实了该算法并不计算每个文件，仅计算具有所需扩展名的文件。 

如果需要，您可以进一步将其改编为较短的竞赛编辑格式或更具解释性的博客风格版本。
