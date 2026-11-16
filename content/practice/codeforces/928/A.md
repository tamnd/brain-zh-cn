---
title: "CF 928A - 登录验证"
description: "我们会得到一个建议的用户名和一组已注册的用户名。 任务是确定新用户名是否可以“安全”使用，这意味着在一组转换规则下，它不被视为等同于任何现有用户名。"
date: "2026-06-17T03:06:50+07:00"
tags: ["codeforces", "competitive-programming", "*special", "strings"]
categories: ["algorithms"]
codeforces_contest: 928
codeforces_index: "A"
codeforces_contest_name: "VK Cup 2018 - \u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f 1"
rating: 1200
weight: 928
solve_time_s: 77
verified: true
draft: false
---

[CF 928A - 登录验证](https://codeforces.com/problemset/problem/928/A)

 **评分：** 1200
 **标签：** *特殊、字符串
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们会得到一个建议的用户名和一组已注册的用户名。 任务是确定新用户名是否可以“安全”使用，这意味着在一组转换规则下，它不被视为等同于任何现有用户名。 

如果可以通过重复应用字符替换将一个用户名转换为另一个用户名，则两个用户名被视为等效。 这些替换定义了字符的等价类：始终允许大写字母和小写字母之间的大小写变化，某些字母和数字可以以特定方式交换，并且某些字符可以通过这些规则链有效地互换。 关键思想是我们不是按字面比较字符串，而是比较它们在这些等价项下的规范含义。 

输入约束很小：最多 1000 个现有用户名，每个长度最多为 50。这立即表明 O(n·L) 方法就足够了，因为即使检查每个字符串的每个字符也只需要大约 50,000 次操作。 任何独立预处理或规范化每个字符串的解决方案都可以轻松满足限制。 

转换规则的模糊性会产生一个微妙的问题。 一种简单的方法可能假设只有少数直接替换很重要，但规则形成了等价链。 例如，如果角色A可以变成B，B可以变成C，那么A和C也是等价的。 忽略传递闭包会导致不正确的比较。 

另一个陷阱是将转换视为定向的。 这些规则是明确双向的，因此每个替换都必须解释为无向等价关系。 

最后，粗心的解决方案可能会在简单的标准化（如小写）之后逐个字符地比较字符串。 这会失败，因为存在数字字母关系（如 0 和 O，或 1 和多个字母），而这些关系不能单独通过大小写标准化来处理。 

## 方法

 暴力破解的想法很简单：对于每个现有的登录名，尝试确定是否可以使用允许的字符替换将其转换为新的登录名。 这需要对每对字符串的字符转换运行搜索或 BFS/DFS。 由于每个字符串的长度最多为 50，并且现有字符串最多为 1000 个，因此如果我们探索每个字符位置的转换状态，这很快就会变得昂贵。 在最坏的情况下，每个字符比较可能会分支为多个替代方案，从而导致每次比较呈指数爆炸。 

关键的观察是我们实际上不需要模拟转换。 我们只需要每个字符的一致表示，以便两个字符当且仅当它们映射到相同的表示时才等效。 这将问题变成了经典的等价类构造问题。 一旦我们将每个字符映射到规范形式，每个登录名都会变成一个规范化的字符串，我们只需检查任何规范化的现有登录名是否与规范化的新登录名相匹配。 

这将问题从字符串上的图形搜索简化为有限字符集的简单预处理，然后进行线性比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力转型搜索| O(n · L · 分支) | O(L) | 太慢了 |
 | 规范映射+比较| O(n·L + 字母处理) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们首先构建字符的等价类。 由于字母表很小且固定（字母、数字、下划线），因此我们可以安全地对转换规则隐含的关系进行硬编码或联合查找。

1. 对所有可能的字符初始化一个不相交集并集 (DSU) 结构。 每个字符都以自己的字符集开始，因为最初我们假设没有等价字符。 
2. 对于每个转换规则，将相应的字符合并到同一集合中。 每次合并都表示两个字符在最终表示中可以互换。 
3. 执行所有并集后，为每个字符定义一个规范代表，例如其集合中按字典顺序排列的最小字符。 
4. 通过将每个字符替换为其代表，将新的登录字符串转换为其规范形式。 
5. 对于每个现有登录名，还使用相同的映射将其转换为其规范形式。 
6. 将每个规范化的现有登录名与规范化的新登录名进行比较。 
7. 如果找到任何匹配项，则新登录冲突，我们输出“No”。 否则，我们输出“Yes”。 

这样做的原因是 DSU 构造将所有传递等价性折叠到一个类中。 两个字符之间的任何有效转换序列都与属于等价图中相同连通分量的它们完全对应。 通过用其组件代表替换每个字符，我们确保所有等效字符映射到相同的符号，并且所有非等效字符映射到不同。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self):
        self.parent = {}
        self.rank = {}

    def find(self, x):
        if x not in self.parent:
            self.parent[x] = x
            self.rank[x] = 0
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1

# Build equivalence relations according to the problem rules
dsu = DSU()

def add_equiv(a, b):
    dsu.union(a, b)

# case-insensitive letters
for c in "abcdefghijklmnopqrstuvwxyz":
    add_equiv(c, c.upper())
    add_equiv(c.upper(), c)

# 'O' and '0'
add_equiv('O', '0')
add_equiv('0', 'O')

# '1' and {l, I}
add_equiv('1', 'l')
add_equiv('1', 'I')
add_equiv('l', 'I')

# closure is handled by DSU

def normalize(s):
    return ''.join(dsu.find(c) for c in s)

s = input().strip()
n = int(input())
target = normalize(s)

for _ in range(n):
    t = input().strip()
    if normalize(t) == target:
        print("No")
        sys.exit()

print("Yes")
```该解决方案在字符上构建并查找结构，并合并所有声明为等效的对。 这`normalize`函数通过将每个字符替换为其 DSU 根来将任何登录名转换为其规范表示形式。 然后比较就变成了精确的字符串相等。 

一个微妙的实现细节是确保输入中出现的所有字符都在 DSU 中延迟初始化，因为并非所有符号都必须出现在预定义的联合中。 另一个重要的一点是，联合运算必须明确反映对称性，即使规则已经暗示了双向性。 

## 工作示例

 ### 示例 1

 输入：```
1_wat
2
2_wat
wat_1
```我们计算规范表示。 

| 步骤| 字符串| 标准化 |
 | --- | --- | --- |
 | 1 | 1_瓦特 | 像 r1_wat 这样的形式（因 DSU 根选择而异） |
 | 2 | 2_瓦特 | 2 的不同根 → 不匹配 |
 | 3 | wat_1 | 1 与 l/I 合并，因此首先匹配 |

 我们比较：

 - 新登录与“2_wat”：不匹配
 - 新登录与“wat_1”：匹配

 所以答案是“是”。 

这显示了数字和字母之间的等价性如何创建从原始字符串中不明显的匹配。 

### 示例 2

 输入：```
Codeforces
1
codef0rces
```| 步骤| 字符串| 标准化 |
 | --- | --- | --- |
 | 1 | 代码力量 | 统一的案例折叠 + O/0 等效 |
 | 2 | 代码来源 | 0 变为 O，大小写差异消失 |

 标准化后，两个字符串变得相同，因此我们检测到冲突并输出“否”。 

这说明了为什么仅简单的大小写标准化是不够的：数字字母等效是至关重要的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n·L α(26)) | O(n·L α(26)) | 每个字符串都会被扫描一次，并且由于 DSU 路径压缩，每个字符查找几乎是恒定的 |
 | 空间| O(1) | O(1) | 人物宇宙是固定且狭小的 |

 该约束允许最多 50,000 个字符操作，这很简单。 即使有 DSU 开销，该解决方案也能在限制范围内舒适地运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    output = []

    class DSU:
        def __init__(self):
            self.parent = {}
            self.rank = {}

        def find(self, x):
            if x not in self.parent:
                self.parent[x] = x
                self.rank[x] = 0
            if self.parent[x] != x:
                self.parent[x] = self.find(self.parent[x])
            return self.parent[x]

        def union(self, a, b):
            ra, rb = self.find(a), self.find(b)
            if ra == rb:
                return
            if self.rank[ra] < self.rank[rb]:
                ra, rb = rb, ra
            self.parent[rb] = ra
            if self.rank[ra] == self.rank[rb]:
                self.rank[ra] += 1

    dsu = DSU()

    for c in "abcdefghijklmnopqrstuvwxyz":
        dsu.union(c, c.upper())
        dsu.union(c.upper(), c)

    dsu.union('O', '0')
    dsu.union('0', 'O')

    dsu.union('1', 'l')
    dsu.union('1', 'I')
    dsu.union('l', 'I')

    def norm(s):
        return ''.join(dsu.find(c) for c in s)

    s = input().strip()
    n = int(input())
    target = norm(s)

    for _ in range(n):
        t = input().strip()
        if norm(t) == target:
            return "No"
    return "Yes"

# provided sample
assert run("1_wat\n2\n2_wat\nwat_1\n") == "Yes"

# same string direct conflict
assert run("a\n1\na\n") == "No"

# case-insensitive match
assert run("Code\n1\ncode\n") == "No"

# digit-letter equivalence
assert run("1\n1\nl\n") == "No"

# underscore unaffected
assert run("a_b\n1\nab\n") == "Yes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 一个与一个| 没有 | 完全相同的匹配 |
 | 代码与代码 | 没有 | 不区分大小写 |
 | 1 对 l | 没有 | 数字-字母等效|
 | a_b 与 ab | 是的 | 下划线不等价 |

 ## 边缘情况

 一个微妙的边缘情况是等价链跨越多个步骤。 例如，如果一个角色通过多次替换间接连接，则简单的成对比较就会错过这种关系。 DSU 通过将传递连接折叠成单个根来处理此问题。 对于像这样的输入`l`， 现存的`I`，和中间`1`，所有三个最终共享相同的代表，因此标准化形式正确重合。 

另一个边缘情况是同时混合大小写和数字转换。 例如，包含两者的字符串`O`和`o`或者`0`仍然必须一致地解决。 由于大小写折叠和数字字母联合都应用在相同的结构中，因此无论转换顺序如何，最终的表示都是稳定的。 

最后，下划线是没有等价物的孤立符号。 该算法永远不会将它们与任何东西结合起来，因此它们仍然是固定点，确保正确区分仅下划线不同的字符串。
