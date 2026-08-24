---
title: "CF 104730A-\u0423\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u0430\u044f\u043f\u0435\u0441\u043d\u044f"
description: "我们有两个字符串集合，每个字符串的大小为 $n$。 我们必须将它们排列成长度为 $2n$ 的单个序列，但位置由奇偶校验固定：每个奇数位置必须包含来自第一个集合的字符串，每个偶数位置必须包含来自...的字符串。"
date: "2026-06-29T02:39:10+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104730
codeforces_index: "A"
codeforces_contest_name: "Moscow team school olympiad (MKOSHP) 2023"
rating: 0
weight: 104730
solve_time_s: 71
verified: true
draft: false
---

[CF 104730A - \u0423\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u0430\u044f \u043f\u0435\u0441\u043d\u044f](https://codeforces.com/problemset/problem/104730/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个字符串集合，每个字符串的大小$n$。 我们必须将它们排列成一个长度序列$2n$，但位置通过奇偶校验固定：每个奇数位置必须包含第一个集合中的字符串，每个偶数位置必须包含第二个集合中的字符串。 

构建这个交替序列后，我们将其划分为相邻对$(1,2), (3,4), \dots, (2n-1,2n)$。 每对贡献的分数等于该对中两个字符串共享的最长后缀的长度。 目标是分配字符串，以使所有对之间的后缀相似度总和最大化。 

一个关键的结构约束是我们不能在集合内或集合之间任意配对。 第一个集合中的每个元素必须与第二个集合中的一个元素恰好配对，并且一对的贡献仅取决于它们共享的后缀结构。 

限制条件很大：$n \le 2 \cdot 10^5$，并且每个集合中所有字符串的总长度的界限为$2 \cdot 10^5$。 这排除了直接比较所有字符串对的任何解决方案，因为即使检查所有交叉对也已经需要最多$O(n^2)$比较。 

当贪婪地考虑将每个字符串与最佳匹配候选者独立配对时，会出现一个微妙的陷阱。 与许多其他字符串共享长后缀的字符串可能会被重复选择，从而阻止更好的全局配对。 例如，如果多个字符串以相同的长后缀结尾，则即使每个本地选择看起来都是最佳的，在不协调的情况下在本地配对它们也会降低总分。 

因此，该任务是后缀相似性的全局匹配问题，而不是一组独立的优化。 

## 方法

 一种直接的方法是计算第一组和第二组之间每对的后缀相似度，然后解决加权二部匹配问题，其中边缘权重是这些后缀长度。 这原则上是正确的，因为每个有效的配对都是独立贡献的。 然而，该图是完全二分图$n^2$边缘，并且在限制下计算甚至存储这些权重是不可能的。 

关键的观察是后缀结构可以使用基于反向字符串构建的 trie 来增量编码。 如果我们反转所有字符串，则后缀将成为反转表示中的前缀。 这将问题转化为基于最长公共前缀（LCP）的配对字符串。 

在反转字符串的字典树中，每个节点对应一个前缀，共享长后缀的字符串对应于共享该字典树中的深层节点。 一对的贡献恰好是它们在特里树中最低共同祖先的深度。 

我们不是显式地评估所有对，而是自下而上地处理特里树。 在每个节点，我们将通过该节点的两组中不匹配的字符串组合起来。 配对总是最好尽早在它们共享的最深节点处完成，因为更深的节点代表更长的公共后缀。 这自然会导致特里结构上的贪婪匹配策略，我们向上传播计数并在本地累积匹配。 

蛮力之所以有效，是因为它显式地比较所有对并选择最佳分配，但在以下情况下会失败：$n^2$交互变得不可行。 基于特里树的聚合用结构分组取代了成对推理，将问题简化为对总字符串长度的线性遍历。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^2 \cdot L)$|$O(n^2)$| 太慢了 |
 | Trie + 自底向上匹配 | ( O(\sum | s | ) ) |

 ## 算法演练

 1. 反转两组中的每个字符串。 这将后缀匹配转换为前缀匹配，允许我们使用 trie 结构。 这很重要的原因是尝试自然地将共享前缀编码为共享路径。 
2. 构建一个包含所有反转字符串的特里树。 在每个终端节点，存储字符串是来自第一组还是第二组。 
3. 对 trie 执行深度优先遍历。 在每个节点，我们从子节点收集两个值：该子树中存在集合 A 和集合 B 中的多少个不匹配的字符串。 
4. 将子节点合并到当前节点后，计算在该节点上可以形成多少个匹配项。 如果我们有$a$第一组的字符串和$b$从第二盘开始，我们可以匹配$\min(a, b)$在此深度配对。 
5.添加答案：$\min(a, b) \times \text{depth}$。 这捕获了最长公共前缀恰好在此节点结束的所有对的贡献。 
6、将剩下的向上传播：匹配后，通过$|a - b|$不匹配的字符串到父节点，跟踪哪一方仍然占主导地位。 

### 为什么它有效

 每对有效的字符串都有一个唯一的最深 trie 节点，它们的路径在此相交。 该节点表示反转字符串的最长公共前缀，它与原始字符串的最长公共后缀完全对应。 该节点的匹配捕获了他们的全部贡献。 任何在 trie 中延迟匹配较高位置的尝试都只会将具有较短公共前缀的字符串配对，从而减少总贡献。 由于匹配总是在尽可能深的点贪婪地执行，因此每个流量单位在其正确的深度处仅被考虑一次，从而确保最优性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**7)

class Node:
    __slots__ = ("next", "cntA", "cntB")
    def __init__(self):
        self.next = {}
        self.cntA = 0
        self.cntB = 0

def add(root, s, typ):
    v = root
    for ch in s:
        if ch not in v.next:
            v.next[ch] = Node()
        v = v.next[ch]
    if typ == 0:
        v.cntA += 1
    else:
        v.cntB += 1

def dfs(v, depth, res):
    a = v.cntA
    b = v.cntB

    for u in v.next.values():
        da, db = dfs(u, depth + 1, res)
        a += da
        b += db

    m = min(a, b)
    res[0] += m * depth
    a -= m
    b -= m

    return a, b

n = int(input())
root = Node()

for _ in range(n):
    s = input().strip()[::-1]
    add(root, s, 0)

for _ in range(n):
    s = input().strip()[::-1]
    add(root, s, 1)

res = [0]
dfs(root, 0, res)
print(res[0])
```该解决方案首先将所有字符串插入到 trie 之前反转它们，确保后缀关系成为前缀关系。 每个叶节点根据它属于第一组还是第二组来递增计数器。 

DFS 从子项向上聚合计数。 关键步骤是使用本地匹配`min(a, b)`在每个节点上，这表示将尽可能多的字符串与当前前缀配对。 乘以`depth`将这些匹配转换为他们对答案的实际贡献。 

返回值`a`和`b`表示无法在更深节点配对的不匹配字符串，必须在其公共前缀较短的更高级别进行考虑。 

## 工作示例

 ### 示例 1

 输入集是：

 第一组：`dca, cba, dcb, bbb`第二组：`fea, fea, aba, bbb`我们跟踪相关特里树深度的聚合。 

| 节点深度| 一个计数 | B 计数 | 比赛进行 | 贡献|
 | --- | --- | --- | --- | --- |
 | 3（bbb）| 1 | 1 | 1 | 3 |
 | 2（后缀组）| 2 | 2 | 2 | 3 × 2 = 4（累计）|
 | 1 | 0 | 0 | 0 | 0 |
 | 根 | 0 | 0 | 0 | 0 |

 最终总和变为$6$。 

该跟踪表明，匹配是在尽可能深的共享后缀节点处贪婪地形成的，从而最大化了每对的贡献。 

### 示例 2

 第一组：`a, bc, bcaa`第二组：`aa, aaa, aaac`| 节点深度| 一个计数 | B 计数 | 比赛进行 | 贡献|
 | --- | --- | --- | --- | --- |
 | 2 (“aa”) | 1 | 2 | 1 | 2 |
 | 1 | 2 | 1 | 1 | 2 |
 | 根 | 0 | 0 | 0 | 0 |

 总计为$4$。 

这演示了如何将较深的匹配优先于较浅的匹配，从而确保尽可能使用长后缀重叠。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | ( O(\sum | s |
 | 空间| ( O(\sum | s |

 两个集合中的字符总数受以下限制$4 \cdot 10^5$，因此该算法可以轻松地满足时间限制。 每个操作的输入大小都是线性的，避免任何二次配对行为。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    sys.setrecursionlimit(10**7)

    class Node:
        def __init__(self):
            self.next = {}
            self.cntA = 0
            self.cntB = 0

    def add(root, s, typ):
        v = root
        for ch in s:
            if ch not in v.next:
                v.next[ch] = Node()
            v = v.next[ch]
        if typ == 0:
            v.cntA += 1
        else:
            v.cntB += 1

    def dfs(v, depth):
        a = v.cntA
        b = v.cntB
        res = 0
        for u in v.next.values():
            da, db, sub = dfs(u, depth + 1)
            a += da
            b += db
            res += sub
        m = min(a, b)
        res += m * depth
        a -= m
        b -= m
        return a, b, res

    n = int(sys.stdin.readline())
    root = Node()

    for _ in range(n):
        add(root, sys.stdin.readline().strip()[::-1], 0)
    for _ in range(n):
        add(root, sys.stdin.readline().strip()[::-1], 1)

    _, _, ans = dfs(root, 0)
    return str(ans)

# provided samples
assert run("""4
dca
cba
dcb
bbb
fea
fea
aba
bbb
""") == "6"

assert run("""3
a
bc
bcaa
aa
aaa
aaac
""") == "4"

# all-equal
assert run("""2
aaa
aaa
aaa
aaa
""") == "6"

# minimal
assert run("""1
a
a
""") == "1"

# no common suffix except trivial
assert run("""2
ab
cd
ef
gh
""") == "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 所有相等的字符串 | 6 | 最深节点的最大匹配|
 | 单对 | 1 | 基本情况正确性 |
 | 不相交的后缀 | 0 | 没有错误匹配 |

 ## 边缘情况

 当两组中的所有字符串都相同时，就会出现一种边缘情况。 在这种情况下，每一对都应该贡献完整的字符串长度。 特里树折叠成一条路径，其中两个计数器在每个深度处完全累加。 在每个节点，`min(a, b)`首先仅在最深级别提取匹配项，确保每对在最大深度处精确计数一次。 

另一种边缘情况是根本不存在后缀重叠。 trie 立即在根处分支，并且没有深层节点包含这两种类型。 全部`min(a, b)`计算在正深度处保持为零，因此答案保持为零，正确反映没有对共享非空后缀。
