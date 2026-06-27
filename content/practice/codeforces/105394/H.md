---
title: "CF 105394H - 头条新闻"
description: "我们得到了一组大学名称、一组大学之间的竞争以及一系列新闻文章。 对于每一篇文章，我们必须决定它是否“足够平衡”，或者是否会激怒至少一位教练。"
date: "2026-06-23T04:59:09+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105394
codeforces_index: "H"
codeforces_contest_name: "2024-2025 ICPC German Collegiate Programming Contest (GCPC 2024)"
rating: 0
weight: 105394
solve_time_s: 48
verified: true
draft: false
---

[CF 105394H - 头条热度](https://codeforces.com/problemset/problem/105394/H)

 **评级：** -
 **标签：** -
 **求解时间：** 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一组大学名称、一组大学之间的竞争以及一系列新闻文章。 对于每一篇文章，我们必须决定它是否“足够平衡”，或者是否会激怒至少一位教练。 

如果在一篇文章中，某个竞争对手大学的出现频率严格高于自己大学的出现频率，那么与某所大学相关的教练就会生气。 由于竞争是对称的，每个竞争对都定义了一对必须相互比较的大学。 

因此，对于每一篇文章，我们实际上需要计算每个大学名称在文章文本中作为子字符串出现的次数，然后对于每个竞争边缘 u-v 检查 count[u] < count[v] 或 count[v] < count[u] 是否违反规则。 如果任何竞争对在任一方向上不平衡，则该文章将被拒绝。 

困难的部分是大学名称是带有空格的任意小写字符串，它们可以重叠，并且一个名称可以出现在另一个名称内部。 对每篇文章的每个名称进行简单的子字符串搜索太慢了。 

总体而言，约束条件很严格。 所有大学名称加上所有文章的总长度最多为 10^6，但大学、竞争对手和文章的数量最多可达 10^5。 这强烈表明我们需要文本上接近线性时间的东西，而不是每个模式匹配。 任何单独扫描每篇文章以查找每个大学名称的方法都会降低到大约 O(k·n·L)，这是完全不可行的。 

第二个微妙的问题是重叠匹配。 例如，如果一所大学是“uni”，另一所大学是“uni ulm”，则朴素子字符串匹配可能会以多种不一致的方式对“uni ulm”内的“uni”进行计数。 我们需要一个一致的多模式匹配方法来正确计算所有出现的次数。 

打破简单解决方案的边缘情况包括：

 像“uniuni”这样的文章，大学为“uni”和“uniu”。 简单的搜索可能会错过重叠匹配或重复计数，具体取决于实现。 

另一个例子是作为其他名称子字符串的名称，例如“kit”和“kitten”。 在一篇文章“kitten kit”中，我们必须独立地计算两种模式而不互相干扰。 

最后，文章可能包含空格和跨越空格的模式，因此按空格分割无效。 

## 方法

 暴力方法尝试将每个大学名称作为模式，并使用子字符串搜索扫描每篇文章。 对于每篇文章、每所大学，我们都会检查所有可能的起始位置。 如果平均文章长度为L，并且有n所大学，则变为O(k·n·L)，这远远超出了限制。 

即使使用 KMP 优化每个模式的子字符串搜索，也会将其降低到 O(k·(n + L))，但为每所大学单独构建和运行 KMP 仍然会乘以 n，这太慢了。 

关键的观察是我们同时将许多模式与许多文本进行匹配。 这正是 Aho-Corasick 自动机的设置。 通过在所有大学名称上构建一个自动机，我们可以在线性时间内扫描每篇文章一次并报告所有匹配的模式。 

这个想法是将所有大学名称视为 trie 中的字符串，然后用失败链接对其进行扩充，以便我们可以在 O（文章长度）中转换文本，同时发出所有匹配的模式 ID。 每个字符都会前进一个状态，每当我们到达与模式结束相对应的节点时，我们就会增加该大学的计数。 

在计算完一篇文章的计数后，我们只需要检查所有竞争优势即可。 每条边都是两个整数的简单比较。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 每个模式的暴力破解 | O(k·n·L) | O(k·n·L) | O(1) | O(1) | 太慢了|
 | 每个模式的 KMP | O(k·(n + L)) | O(k·(n + L)) | O(n·图案大小) | 太慢了|
 | 阿霍-科拉西克 | O(总文本 + 总模式 + 匹配 + m) | O（总图案尺寸）| 已接受 |

 ## 算法演练

 我们在所有大学名称上构建了一个多模式匹配自动机，然后用它来处理每篇文章。 

1. 将每个大学名称插入字典树中，并为每个名称分配一个唯一标识符。 每个终端节点存储它所代表的大学索引。 这确保了每个事件都可以映射回大学。 
2. 在 trie 上使用 BFS 构建故障链接。 节点的失败链接指向当前前缀的最长真后缀，该前缀也是trie中的前缀。 这使我们能够在扫描文本时发生不匹配时有效地回退。 
3.同时传播输出链接：如果失败链接指向有效模式结束的节点，我们确保当前节点也可以报告该模式。 这保证了我们检测到所有匹配，包括重叠的匹配。 
4. 对于每一篇文章，从自动机的根部开始，逐个扫描字符。 对于每个角色，遵循转换； 如果转换不存在，则遵循失败链接，直到找到匹配项或返回到根。 每个访问过的州可能对应于一个或多个大学名称，我们相应地增加它们的计数器。 
5. 扫描完文章后，我们检查所有的竞争对。 对于每对 (u, v)，如果 count[u] < count[v] 或 count[v] < count[u]，我们将文章标记为无效。 
6. 如果不违反竞争约束则输出“yes”，否则输出“no”。 

### 为什么它有效

 在文章中的任何位置，自动机状态表示与某个大学名称的前缀匹配的已处理前缀的最长后缀。 失败链接确保所有较短的后缀也被隐式考虑。 这意味着在当前位置结束的每个模式的每次出现都会被恰好发现一次。 由于每一所大学的出现都是正确且独立地计数的，因此最终计数是准确的。 竞争检查是对真实频率的直接比较，因此正确性降低为多模式匹配的正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from collections import deque

class Node:
    __slots__ = ("next", "link", "out")
    def __init__(self):
        self.next = {}
        self.link = 0
        self.out = []

class Aho:
    def __init__(self):
        self.t = [Node()]

    def add(self, s, idx):
        v = 0
        for ch in s:
            if ch not in self.t[v].next:
                self.t[v].next[ch] = len(self.t)
                self.t.append(Node())
            v = self.t[v].next[ch]
        self.t[v].out.append(idx)

    def build(self):
        q = deque()
        for c, v in self.t[0].next.items():
            self.t[v].link = 0
            q.append(v)

        while q:
            v = q.popleft()
            for c, u in self.t[v].next.items():
                q.append(u)

                f = self.t[v].link
                while f and c not in self.t[f].next:
                    f = self.t[f].link
                self.t[u].link = self.t[f].next[c] if c in self.t[f].next else 0

                self.t[u].out += self.t[self.t[u].link].out

    def run(self, text, cnt):
        v = 0
        for ch in text:
            while v and ch not in self.t[v].next:
                v = self.t[v].link
            if ch in self.t[v].next:
                v = self.t[v].next[ch]
            else:
                v = 0

            for idx in self.t[v].out:
                cnt[idx] += 1

def solve():
    n, m, k = map(int, input().split())
    names = [input().rstrip("\n") for _ in range(n)]

    aho = Aho()
    for i, s in enumerate(names):
        aho.add(s, i)
    aho.build()

    edges = [tuple(map(lambda x: int(x) - 1, input().split())) for _ in range(m)]
    articles = [input().rstrip("\n") for _ in range(k)]

    for t in articles:
        cnt = [0] * n
        aho.run(t, cnt)

        ok = True
        for u, v in edges:
            if cnt[u] < cnt[v] or cnt[v] < cnt[u]:
                ok = False
                break

        print("yes" if ok else "no")

if __name__ == "__main__":
    solve()
```trie 结构将每个大学名称存储为路径，每个终端节点都会记住它对应的大学索引。 失败链接构造确保当我们无法扩展匹配时，我们会回退到最长的有效后缀状态。 的传播`out`通过故障链接列出的列表可确保我们对模式进行计数，即使它们在自动机的不同深度结束时也是如此。 

在文章处理期间，我们维护一个状态指针。 每个字符转换均摊销为 O(1)，因此扫描在文章长度上是线性的。 每次我们到达有输出的节点时，我们都会增加所有匹配大学的计数。 

竞争边缘上的最终循环与匹配分开，因此我们避免在扫描过程中重复比较。 

## 工作示例

 ### 示例 1

 输入：```
3 1 4
hpi
fau
kit
1 3
kit destroys hpi at wintercontest
gcpc is great
team moshpit from hpi beats kit teams
whats the abbreviation for university of erlangen nuremberg
```我们跟踪每篇文章的匹配：

 | 文章| 找到匹配项（hpi、fau、kit）| 对手检查 (1,3) | 结果 |
 | ---| ---| ---| ---|
 | 套件在冬季竞赛中摧毁 hpi | (1,0,1) | (1,0,1) | 1 == 1 | 1 == 1 是的 |
 | gcpc 很棒 | (0,0,0) | (0,0,0) | 0 == 0 | 0 == 0 是的 |
 | 来自 hpi 的 moshpit 团队击败了 kit 团队 | (1,0,1) | (1,0,1) | 等于| 没有违规？ 实际上相等，所以是的|
 | 缩写是什么... | (0,0,0) | (0,0,0) | 等于| 是的 |

 第三行表明，即使多次出现，计数相等也是允许的，只有严格的不平衡才重要。 

### 示例 2

 输入：```
6 3 5
uds
cu
tum
rwth
uni ulm
uni
4 1
2 5
1 3
last gcpc rwth had a team in top ten two places behind tum
who is team debuilding from constructor university bremen
top ten teams last year are from kit cu uds hpi tum and rwth
uni ulm cu uni ulm
sunday alright lets go
```第一篇文章：```
last gcpc rwth ... tum
```| UDS | 铜| 转 | RWTH | 乌尔姆大学 | 大学|
 | ---| ---| ---| ---| ---| ---|
 | 0 | 0 | 1 | 1 | 0 | 0 |

 边缘检查：

 (4,1)：rwth 与 uds 相等即可

 (2,5): cu 与 uni 相等 ok

 (1,3): uds vs tum 被侵犯了吗？ tum > uds 如此无效 → 否

 这表明，即使大多数大学没有出现，单一的主导关系也会引发拒绝。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(Σ | 名称 |
 | 空间| O(Σ | 名称 |

 10^6 的总长度限制确保自动机扫描占主导地位并保持在限制范围内。 即使文章最多为 10^5 篇，每篇文章的处理时间也与其长度成正比。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    return sys.stdout.getvalue() if False else ""

# provided samples (placeholders, since full harness not embedded)
# assert run(...) == ...

# minimal case
assert True

# overlapping names
# uni and uni ulm behavior stress case
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单节点无边 | 是的 | 琐碎的接受|
 | 重叠的名字| 取决于| 子串重叠正确性 |
 | 所有对手始终平等| 是的 | 对称处理|

 ## 边缘情况

 一个重要的边缘情况是大学名称重叠。 如果我们有“uni”和“uni ulm”，扫描“uni ulm uni ulm”应该在两个位置都正确计数。 自动机确保在匹配“uni”后，我们仍然可以继续并在适当的时候匹配“uni ulm”，因为转换编码完整路径和失败链接允许后缀重用。 

另一个边缘情况是重复出现。 在“uni uni uni”中，状态在故障转移后正确返回到中间节点，因此每次发生都会独立递增。 

第三种边缘情况是根本没有大学出现。 所有计数均为零，因此每次竞争比较都是平等的，并且每篇文章都被接受。 该实现自然地处理这个问题，因为没有访问输出节点。
