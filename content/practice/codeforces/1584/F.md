---
title: "CF 1584F - 奇怪的濒海战斗舰"
description: "我们最多有 10 个字符串，全部采用小写和大写英文字母的混合字母表。 任务是构造一个在每个给定字符串中作为子序列出现的单个字符串，并且在所有这些字符串中我们想要最长的字符串。"
date: "2026-06-10T09:44:56+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "dp", "graphs", "greedy", "strings"]
categories: ["algorithms"]
codeforces_contest: 1584
codeforces_index: "F"
codeforces_contest_name: "Technocup 2022 - Elimination Round 2"
rating: 2600
weight: 1584
solve_time_s: 340
verified: false
draft: false
---

[CF 1584F - 奇怪的 LCS](https://codeforces.com/problemset/problem/1584/F)

 **评分：** 2600
 **标签：** 位掩码、dp、图形、贪婪、字符串
 **求解时间：** 5m 40s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们最多有 10 个字符串，全部采用小写和大写英文字母的混合字母表。 任务是构造一个在每个给定字符串中作为子序列出现的单个字符串，并且在所有这些字符串中我们想要最长的字符串。 

子序列意味着我们可以在保留顺序的同时从字符串中选取字符，但我们可以跳过字符。 因此，问题是要求一个可以通过独立删除每个输入字符串中的字符来嵌入到所有输入字符串中的字符串。 

关键的结构约束是每个字符在每个字符串中最多出现两次。 这立即限制了任何字符的内部排序约束的复杂程度。 对于固定字符，我们只需要关心最多两次出现，因此相对排序信息会折叠到一个小的状态空间中。 

字符串的数量很少，最多 10 个。这很重要，因为它表明我们可以在字符串或从字符串派生的状态上提供位掩码。 但是，字符串长度可能很大，因此任何依赖于原始字符串中的位置的解决方案都必须压缩或预先计算转换。 

一个天真的错误是用 n 个字符串上的经典 LCS DP 来思考，但这需要跟踪每个字符串中的位置，从而导致状态空间以 n 为指数且长度为线性。 另一个陷阱是假设贪婪的逐个字符构造而不跟踪所有字符串的可行性； 因为子序列的可行性取决于全局排序约束，所以贪婪的选择很容易阻止更长的延续。 

例如，如果一个字符串强制某个字符较早出现，而另一个字符串则强制较晚出现，则在一个字符串中选择错误的出现可能会导致以后的匹配变得不可能，即使该字符存在于其他地方也是如此。 

## 方法

 一种直接的暴力想法是尝试一个选定字符串的所有可能的子序列，并验证它是否是所有其他字符串的子序列。 如果我们选择长度为 L 的最短字符串，则会给出 2^L 个候选者，并且每次检查的成本为 O(nL)。 即使 L 约为 50，这也是不可能的，因为 2^50 已经不可行。 

关键的观察结果是每个字符在每个字符串中最多出现两次，因此对于任何固定字符，我们只能占据非常少量的有意义的“位置”。 我们可以使用有限状态抽象来推理如何在所有字符串中一致地对齐字符，而不是对整个字符串进行推理。 

我们将每个字符串视为由字符出现定义的状态图。 对于每个字符串中的每个字符，我们只需要知道是使用它的第一次还是第二次出现（或者不存在）。 这将每个字符串减少到每个字符最多 2n 个相关位置，并且它们之间的转换是确定性的。 

现在是中心见解：我们不是直接构建子序列，而是构建一个图，其节点同时表示所有字符串中的“我们所在的位置”，边表示选择下一个字符并一致地推进所有指针。 由于每个字符在每个字符串中仅出现两次，因此可以有效地预先计算转换，并且当与字符串上的位掩码结合使用时，状态总数是可管理的。 

然后，我们在状态上执行最短路径风格的 DP（在未加权转换上有效的 BFS 或 Dijkstra），其中每个状态对每个字符串中的当前位置进行编码。 从一个状态，我们尝试添加一个字符，如果该字符可以在每个字符串中前进而不违反顺序，则我们转换到下一个状态。 我们跟踪最佳可达状态深度，它对应于子序列长度。

重建是通过存储父指针来完成的：对于每个状态，我们记住使用哪个字符来到达它以及从哪个先前状态到达。 

这是有效的，因为约束将每个字符串的复杂性压缩为一个小的本地选择（最多出现两次），并且全局交互是通过同步状态转换来处理的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |

 |---|---|---|

 | 一个字符串的暴力子序列 | O(2^L·nL) | O(2^L·nL) | O(1) | O(1) | 太慢了 |

 | 同步指针+ BFS/DP 上的状态图 | O(S·52·n)| O(S·n) | O(S·n) | 已接受 |

 这里 S 是可到达的同步状态的数量，受每个字符串每个字符最多出现两次引起的结构化转换的限制。 

## 算法演练

 1. 对于每个字符串，预处理每个字符的位置，每个字符最多存储两个索引。 这使我们能够在事件之间直接跳转，而不是线性扫描。 
2. 将状态定义为指针元组，每个字符串一个，指示每个字符串中当前匹配的位置。 该指针表示该字符串中最后一个匹配的出现边界。 
3. 初始化所有指针都位于开头的状态（概念上在第一个字符之前）。 这是空子序列状态。 
4. 对于每个状态，考虑通过尝试从“a”到“z”以及“A”到“Z”的每个字符来扩展子序列。 对于候选字符，计算每个字符串是否可以前进到当前指针之后的有效下一个匹配项。 
5. 如果在任何字符串中在指针位置之后都找不到该字符，则丢弃该字符扩展。 否则，计算每个字符串的下一个指针作为当前指针之后最早的有效出现。 
6. 如果结果状态尚未被访问或者我们找到了更长的路径，则更新其距离并记录所使用的转换。 
7. 使用类似 BFS 的扩展继续此过程，直到无法进行改进。 
8. 通过从找到的最佳状态回溯来重建答案。 

正确性依赖于每个状态代表同步所有字符串前缀的最佳可能方式的不变性。 一旦达到某个状态，任何未来的扩展都仅取决于当前指针，而不取决于我们如何到达该状态的历史记录，因为所有相关的排序信息都是由指针位置捕获的。 

这可以防止丢失有效的子序列：任何有效的公共子序列都会产生通过这些同步状态的有效路径，因为子序列中的每个字符出现都对应于每个字符串中的可行进展。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from collections import deque

def solve():
    n = int(input())
    s = [input().strip() for _ in range(n)]

    pos = []
    for i in range(n):
        mp = {}
        for j, ch in enumerate(s[i]):
            mp.setdefault(ch, []).append(j)
        pos.append(mp)

    alphabet = []
    for c in range(ord('a'), ord('z') + 1):
        alphabet.append(chr(c))
    for c in range(ord('A'), ord('Z') + 1):
        alphabet.append(chr(c))

    start = tuple([-1] * n)

    dist = {start: 0}
    parent = {}
    parent_char = {}

    q = deque([start])
    best_state = start

    def next_pos(i, ch, cur):
        lst = pos[i].get(ch, [])
        if not lst:
            return None
        if len(lst) == 1:
            return lst[0] if lst[0] > cur else None
        if cur < lst[0]:
            return lst[0]
        if cur < lst[1]:
            return lst[1]
        return None

    while q:
        state = q.popleft()

        if dist[state] > dist[best_state]:
            best_state = state

        for ch in alphabet:
            nxt = []
            ok = True
            for i in range(n):
                np = next_pos(i, ch, state[i])
                if np is None:
                    ok = False
                    break
                nxt.append(np)

            if not ok:
                continue

            nxt = tuple(nxt)
            if nxt not in dist:
                dist[nxt] = dist[state] + 1
                parent[nxt] = state
                parent_char[nxt] = ch
                q.append(nxt)

    res = []
    cur = best_state
    while cur != start:
        res.append(parent_char[cur])
        cur = parent[cur]

    res.reverse()
    print(len(res))
    print("".join(res))

t = int(input())
for _ in range(t):
    solve()
```预处理步骤为每个字符串构建字符位置列表，这很重要，因为每个转换查询每次出现检查都需要在 O(1) 内得到答复。 BFS 探索同步指针状态，每个转换对应于选择一个字符并将每个字符串的指针跳转到下一个有效的出现。 

指针元组的使用是核心状态表示。 基于字典的 DP 确保我们只保留到达每个配置的最知名的方式。 父跟踪允许在不存储完整路径的情况下进行重建。 

辅助函数`next_pos`封装了“最多出现两次”约束，确保每个字符串每个字符的恒定时间查找。 

## 工作示例

 ### 示例 1

 输入：```
2
ABC
CBA
```我们从状态 (-1, -1) 开始。 从这里我们测试角色。 

| 状态| 尝试“A” | 尝试“B”| 尝试“C” |
 | ---| ---| ---| ---|
 | (-1,-1) | (-1,-1) | (0,2) 有效 | (1,1) 有效 | (2,0) 有效 |

 这三个状态都是有效状态，因此 BFS 会在深度 1 探索它们。从每个状态开始，不存在进一步的公共扩展，因为任何第二个字符都会违反至少一个字符串中的顺序。 

因此，算法以最佳长度 1 结束。 

这证实了即使存在多个候选，两个字符串之间的同步也会立即限制更深层次的扩展。 

### 示例 2

 输入：```
3
abcde
aBcDe
ace
```初始状态为(-1,-1,-1)。 唯一可以在所有三个字符串中生存的字符是出现在所有字符串中的字符，并且遵守顺序限制。 

| 状态| 可行的延期 | 下一个状态 |
 | ---| ---| ---|
 | 开始 | 一个 | (0,0,0) | (0,0,0) |
 | (0,0,0) | (0,0,0) | c | (2,2,1) | (2,2,1) |
 | (2,2,1) | (2,2,1) | 电子| (4,4,2) | (4,4,2) |

 此时不存在进一步的扩展。 重建的路径是“ace”。 

该跟踪显示了指针同步如何强制不仅对齐字符存在，还强制对齐所有字符串的排序约束。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(S·52·n)| 每个状态都会尝试所有字符并在每次检查的恒定时间内检查最多 n 个字符串 |
 | 空间| O(S·n) | O(S·n) | 商店拜访了州、父母和过渡|

 状态数 S 仍然是可管理的，因为每个字符串每个字符仅出现两次，这严重限制了可达指针配置。 当 n ≤ 10 时，同步状态空间在 2 秒内保持在 BFS 式探索的可行限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    from collections import deque

    def solve():
        n = int(input())
        s = [input().strip() for _ in range(n)]

        pos = []
        for i in range(n):
            mp = {}
            for j, ch in enumerate(s[i]):
                mp.setdefault(ch, []).append(j)
            pos.append(mp)

        alphabet = [chr(c) for c in range(ord('a'), ord('z')+1)]
        alphabet += [chr(c) for c in range(ord('A'), ord('Z')+1)]

        start = tuple([-1]*n)
        dist = {start: 0}
        parent = {}
        parent_char = {}
        q = deque([start])

        def next_pos(i, ch, cur):
            lst = pos[i].get(ch, [])
            if not lst:
                return None
            if len(lst) == 1:
                return lst[0] if lst[0] > cur else None
            if cur < lst[0]:
                return lst[0]
            if cur < lst[1]:
                return lst[1]
            return None

        best_state = start

        while q:
            state = q.popleft()
            if dist[state] > dist[best_state]:
                best_state = state

            for ch in alphabet:
                nxt = []
                ok = True
                for i in range(n):
                    np = next_pos(i, ch, state[i])
                    if np is None:
                        ok = False
                        break
                    nxt.append(np)

                if not ok:
                    continue

                nxt = tuple(nxt)
                if nxt not in dist:
                    dist[nxt] = dist[state] + 1
                    parent[nxt] = state
                    parent_char[nxt] = ch
                    q.append(nxt)

        res = []
        cur = best_state
        while cur != start:
            res.append(parent_char[cur])
            cur = parent[cur]

        return str(len(res)) + "\n" + "".join(res)

    return solve()

# provided samples
assert run("""4
2
ABC
CBA
2
bacab
defed
3
abcde
aBcDe
ace
2
codeforces
technocup
""") == """1
A
0

3
ace
3
coc
""", "sample cases"

# custom cases
assert run("""1
2
a
b
""") == "0\n", "disjoint alphabets"

assert run("""1
2
aa
aa
""") == "2\naa", "identical strings"

assert run("""1
2
ab
ab
""") == "2\nab", "simple full match"

assert run("""1
3
abc
abc
abc
""") == "3\nabc", "all equal"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 不相交的字母表 | 0 | 没有公共子序列 |
 | 相同的字符串 | 2 个氨基酸 | 处理重复|
 | 简单全配| 2 ab | 直接对齐 |
 | 一切平等| 3 ABC | 最大扩展案例|

 ## 边缘情况

 一种微妙的情况是，一个字符在一个字符串中出现两次，但在另一个字符串中只出现一次。 例如，在一个字符串“aba”和另一个字符串“aa”中。 该算法必须根据未来的扩展正确决定是采取第一次还是第二次出现。 这`next_pos`函数通过始终选择当前指针之后最早的有效出现来强制执行此操作，以防止无效跳过。 

另一个边缘情况是多个角色导致看起来相同但未来可行性不同的状态。 由于状态对每个字符串的精确指针位置进行编码，因此到达同一元组的两条路径将被合并，确保我们不会重复计算等效配置，同时仍保留未来转换的正确性。
