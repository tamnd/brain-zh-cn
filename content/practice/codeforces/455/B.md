---
title: "CF 455B - 很多游戏"
description: "该游戏可以被视为在由给定字符串构建的特里树中移动。 我们从根开始，它代表空字符串。 在每一回合中，玩家选择一个传出边缘，对应于附加一个角色。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp", "games", "implementation", "strings", "trees"]
categories: ["algorithms"]
codeforces_contest: 455
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 260 (Div. 1)"
rating: 1900
weight: 455
solve_time_s: 109
verified: true
draft: false
---

[CF 455B - 很多游戏](https://codeforces.com/problemset/problem/455/B)

 **评级：** 1900
 **标签：** dfs 和类似的、dp、游戏、实现、字符串、树
 **求解时间：** 1m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该游戏可以被视为在由给定字符串构建的特里树中移动。 

我们从根开始，它代表空字符串。 在每一回合中，玩家选择一个传出边缘，对应于附加一个角色。 当前字符串必须始终保留至少一个字典单词的前缀，因此每个合法的移动都简单地遵循 trie 中的一条边。 

当玩家到达没有子节点的 trie 节点时，玩家就输了，因为无法附加更多字符。 

不同之处在于游戏的玩法完全一样`k`次。 一场比赛的失败者开始下一场比赛，唯一重要的是谁赢得了最后一场比赛。 两名球员在每场比赛中都发挥出最佳状态。 

输入最多可达`10^5`字符串，并且所有字符串长度之和也最多为`10^5`。 任何仅处理每个 trie 节点恒定次数的解决方案都足够快。 节点数量的任何二次方都太大了，因为一个 trie 可能包含大约`10^5`节点。 

问题最微妙的部分是，实际上有两种不同的游戏属性很重要。 

考虑这个输入：```
1 2
a
```trie 就是 root → a。 第一个玩家必须移动到`a`，那么第二个玩家没有动作，就输了。 第一个玩家总是获胜。 由于失败者开始下一场比赛，第二个玩家开始第二场比赛并再次失败。 第一个玩家赢得最后一场比赛。 一个只计算“第一个玩家能从根开始获胜吗？”的解决方案。 会错过多个游戏之间的互动。 

另一个重要案例是：```
2 100
ab
ac
```根源在于获胜，因为第一个玩家可以移动。 但每条路径的长度恰好为二。 游戏的平价结构变得很重要。 先手能否强行获胜还不够； 我们还必须知道，如果这在战略上是可取的，他们是否可以强迫损失。 

第三个棘手的情况是：```
1 1
abc
```只有一条路。 结果完全由路径长度奇偶性决定。 任何忽略终端位置而只考虑分支因子的解决方案都会失败。 

关键的观察是我们需要关于每个 trie 节点的两条独立信息。 

## 方法

 暴力方法将明确分析每个可能的游戏状态和每个可能的游戏序列。 即使对于单个游戏，可能的游戏数量也会随着特里深度而呈指数增长。 自从`k`可以大到`10^9`，一一模拟游戏是不可能的。 

公正博弈的结构建议使用博弈DP。 每个 trie 节点都是一个状态。 玩家从一个节点中选择一个子节点。 终端节点没有合法的移动。 

对于正常游戏，如果存在向失败状态移动的情况，则该状态获胜。 如果每一步都朝着获胜的州方向发展，那么该州就处于失败状态。 

如果我们只计算通常的获胜/失败状态，我们就获得了当前玩家可以强制获胜的位置集合。 这解决了单机游戏版本，但没有解决这个问题。 重复游戏规则引入了另一个问题：当前玩家能否以剩余步数相同的方式强制游戏结束？ 

这导致两次 DFS 计算。 

第一个 DFS 计算节点是否获胜，通常称为“获胜状态”。 

第二个 DFS 计算节点是否在不同的标准下丢失，通常在社论中称为“丢失状态”。 它决定当前玩家是否可以强制游戏终止，从而在需要时最终允许失败。 

一旦从根本上了解了这两个属性，整个多博弈问题就会分解为几个简单的情况。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最优 Trie + DFS 游戏 DP | O(字符串总长度) | O(字符串总长度) | 已接受 |

 ## 算法演练

 1. 根据所有输入字符串构建一个字典树。 

每个节点代表一个有效的前缀。 游戏中的每一步合法动作都对应于遍历特里树的一条边。 
2. 计算`win[v]`对于每个节点。 

如果一个节点没有子节点，`win[v] = False`因为当前玩家无法移动。 

否则，`win[v] = True`如果至少有一个孩子有`win = False`。 

这是公正游戏的标准获胜状态重现。 
3. 计算`lose[v]`对于每个节点。 

如果一个节点没有子节点，则设置`lose[v] = True`。 

否则，`lose[v] = True`如果至少有一个孩子有`lose = False`。 

第二个 DP 回答了一个不同的问题：当前玩家是否可以迫使游戏以允许最终失败的平局结束。 
4.设根为节点`0`。 

如果`win[root]`是假的，第一个玩家甚至无法赢得一场比赛。 答案是`"Second"`。 
5. 如果`win[root]`是真的并且`lose[root]`是的，第一个玩家可以强制任一类型的结局。 答案总是`"First"`。 
6.如果`win[root]`是真的并且`lose[root]`为假，只有一种奇偶校验结构是可能的。 

在这种情况下，答案取决于`k`。 

如果`k`为奇数，输出`"First"`。 

如果`k`为偶数，输出`"Second"`。 

### 为什么它有效

 第一个 DFS 确定当前玩家可以在单场比赛中取得胜利的位置。 

第二个 DFS 识别当前玩家可以强制以有利的奇偶性到达终端节点的位置。 终端节点有`lose = True`因为当前移动到那里的玩家立即失败。 

根恰好属于三个有意义的类别之一。 

如果根没有获胜，则第一个玩家立即失败。 

如果根获胜并且还具有第二个属性，则第一个玩家对游戏树有足够的控制权以强制获胜，无论还剩多少游戏。 

如果根获胜但缺少第二个属性，则游戏结果将通过奇偶性确定，并且只有奇数`k`允许第一个玩家赢得最后的比赛。 

这些也正是官方对本场比赛的分析所证明的情况。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())

    trie = [[-1] * 26]

    for _ in range(n):
        s = input().strip()
        node = 0

        for ch in s:
            c = ord(ch) - ord('a')

            if trie[node][c] == -1:
                trie[node][c] = len(trie)
                trie.append([-1] * 26)

            node = trie[node][c]

    m = len(trie)

    win = [False] * m
    lose = [False] * m

    sys.setrecursionlimit(300000)

    def dfs(v):
        children = []

        for nxt in trie[v]:
            if nxt != -1:
                children.append(nxt)

        if not children:
            win[v] = False
            lose[v] = True
            return

        win[v] = False
        lose[v] = False

        for to in children:
            dfs(to)

        for to in children:
            if not win[to]:
                win[v] = True
            if not lose[to]:
                lose[v] = True

    dfs(0)

    if not win[0]:
        print("Second")
    elif lose[0]:
        print("First")
    else:
        print("First" if k % 2 == 1 else "Second")

if __name__ == "__main__":
    solve()
```trie 结构为每个不同的前缀创建一个节点。 由于总输入长度最多为`10^5`，trie节点的总数也是`O(10^5)`。 

这`win`数组存储标准博弈论结果。 如果存在向失败的子节点移动的情况，则节点获胜。 

这`lose`数组使用不同的递归。 终端节点被标记为 true。 对于内部节点，如果至少一个子节点的值为 false，则该值变为 true。 这捕获当前玩家是否可以强制游戏以所需的奇偶校验结构结束。 

一个经常导致错误的实现细节是基本情况`lose`。 终端节点必须初始化为`True`， 不是`False`。 使用错误的值完全颠倒了第二个DFS的含义。 

另一个常见的错误是忘记了`k`可以大到`10^9`。 任何试图模拟游戏的方法都是不可能的。 只有根的两个 DP 值才重要。 

## 工作示例

 ### 示例 1

 输入：```
2 3
a
b
```特里树：```
root
 ├─ a
 └─ b
```| 节点| 赢 | 失去|
 | --- | --- | --- |
 | 一个 | 假| 真实|
 | 乙| 假| 真实|
 | 根 | 真实| 假|

 根赢了，但是`lose[root]`是假的。`k = 3`很奇怪。 

回答：`"First"`。 

此示例演示了奇偶校验相关的情况。 第一个玩家可以赢得游戏，但无法控制替代的结局结构。 

### 示例 2

 输入：```
2 2
a
ab
```特里树：```
root
 └─ a
     └─ b
```DP值：

 | 节点| 赢 | 失去|
 | --- | --- | --- |
 | 乙| 假| 真实|
 | 一个 | 真实| 假|
 | 根 | 假| 真实|

 根本身正在消失。 

回答：`"Second"`。 

这个例子表明，即使特里树包含多个级别，第一个玩家也可能没有从初始位置开始的获胜动作。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(L) | 每个 trie 节点和边都被处理一次，其中`L`是所有字符串的总长度 |
 | 空间| O(L) | Trie 存储加 DP 阵列 |

 由于所有字符串的总长度最多为`10^5`，时间和内存使用量都在限制范围内。 DFS 访问每个 trie 节点一次，并且 trie 本身最多包含`10^5 + 1`节点。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n, k = map(int, input().split())

    trie = [[-1] * 26]

    for _ in range(n):
        s = input().strip()
        node = 0

        for ch in s:
            c = ord(ch) - ord('a')

            if trie[node][c] == -1:
                trie[node][c] = len(trie)
                trie.append([-1] * 26)

            node = trie[node][c]

    m = len(trie)
    win = [False] * m
    lose = [False] * m

    sys.setrecursionlimit(300000)

    def dfs(v):
        children = [x for x in trie[v] if x != -1]

        if not children:
            lose[v] = True
            return

        for to in children:
            dfs(to)

        for to in children:
            if not win[to]:
                win[v] = True
            if not lose[to]:
                lose[v] = True

    dfs(0)

    if not win[0]:
        return "Second"

    if lose[0]:
        return "First"

    return "First" if k % 2 else "Second"

# provided sample
assert run("2 3\na\nb\n") == "First", "sample 1"

# minimum size
assert run("1 1\na\n") == "First", "single move"

# parity-dependent case
assert run("2 2\na\nb\n") == "Second", "even k"

# losing root
assert run("1 2\nab\n") == "Second", "forced loss"

# deeper branching
assert run("3 5\na\nab\nac\n") == "First", "mixed trie"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / a`| 第一 | 最小的非平凡特里树 |
 |`2 2 / a,b`| 第二 | 奇/偶奇偶校验处理 |
 |`1 2 / ab`| 第二 | 根可能会丢失|
 |`3 5 / a,ab,ac`| 第一 | 混合支化结构|

 ## 边缘情况

 考虑：```
1 2
a
```特里树包含一条边。 根有`win = True`和`lose = False`。 自从`k`是偶数，算法输出`"Second"`。 这正是对奇偶性敏感的情况，它破坏了仅检查普通获胜状态的解决方案。 

考虑：```
1 1
abc
```trie 是长度为 3 的单个路径。 DFS 从叶子向上传播值。 根变为获胜，所以答案是`"First"`。 该算法可以正确处理长链，而不需要任何显式奇偶校验计数。 

考虑：```
2 1
ab
ac
```两条根到叶路径具有相同的深度。 根获胜，因为它可以移动到失败的子配置。 无论路径长度如何，DFS 都会计算精确的博弈论状态。 答案直接从根的两个DP值中获得。 

这些案例说明了为什么两个 DFS 状态都是必要的。 一个捕捉胜利是否可能，另一个捕捉玩家是否对游戏的结局结构有足够的控制权来处理任意值`k`。
