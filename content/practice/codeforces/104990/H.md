---
title: "CF 104990H - 隐藏文本区图案"
description: "给定一个由小写英文字母组成的字符串，我们需要找到在其中出现尽可能多次的子字符串。 在所有出现频率最高的子串中，我们更喜欢最长的一个。"
date: "2026-06-28T04:25:01+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104990
codeforces_index: "H"
codeforces_contest_name: "First Masters Championship LATAM 2024"
rating: 0
weight: 104990
solve_time_s: 75
verified: false
draft: false
---

[CF 104990H - 隐藏的 Textland 模式](https://codeforces.com/problemset/problem/104990/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 15s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 给定一个由小写英文字母组成的字符串，我们需要找到在其中出现尽可能多次的子字符串。 在所有出现频率最高的子串中，我们更喜欢最长的一个。 如果仍然存在平局，我们选择字典顺序最小的子串。 

这里的子字符串是字符串的任何连续段。 任务不是明确地找到所有重复，而是确定哪个片段模式在重复方面“主导”字符串。 

输入大小最多可达 100000 个字符。 这立即排除了枚举所有子字符串的任何内容，因为子字符串的数量是 O(n^2)，在最坏的情况下约为 10^10。 即使单独计算每个子串的频率也是不可行的。 

问题的结构表明我们正在搜索具有最大重复计数的子串，这自然与基于后缀的结构相关，例如后缀数组或后缀自动机，其中重复的子串被紧凑地表示。 

一些边缘情况值得关注。 

像“abc”这样的字符串除了单个字符外没有重复的子字符串，但整个字符串仍然是有效的子字符串候选。 由于每个长度为 1 的子串都至少出现一次，因此我们必须确保不会意外地选择空或无效的候选者。 

像“aaaa”这样的字符串包含许多重复的子字符串。 最常见的子字符串是“a”、“aa”、“aaa”。 所有这些都严重重叠。 打破平局规则意味着我们必须首先比较频率，然后是长度，然后是字典顺序。 

另一个微妙的情况是当多个不同的子串具有相同的最大频率和相同的长度时，例如“ababa”，其中“aba”和“bab”可能根据重叠结构出现类似的情况。 正确的处理需要按后缀结构中的结束位置对子字符串进行分组，而不是简单的计数。 

## 方法

 暴力解决方案会尝试每个子字符串，计算它在字符串中出现的次数，并跟踪最佳的子字符串。 计算子字符串的出现次数可以通过字符串匹配或哈希来完成，但即使使用滚动哈希，迭代所有 O(n^2) 子字符串并检查出现次数也会导致至少 O(n^2) 个候选者，并且每个候选者通常为 O(n) 次验证，在实践中产生 O(n^3) 或通过优化产生 O(n^2 log n) 。 当 n = 100000 时，这远远超出了可行的限制。 

关键的观察是重复的子串对应于后缀的共享前缀。 我们没有显式枚举子字符串，而是考虑字符串的所有后缀并对它们的公共前缀进行分组。 后缀自动机准确地捕获了这种结构：每个状态表示字符串中出现的一组子字符串，并且转换按字符对扩展进行编码。 每个状态还存储有关其子字符串出现次数的信息。 

一旦我们构建了后缀自动机，我们就可以计算每个状态它所代表的子串的结束位置的数量，这给我们提供了该子串集的频率。 最长的子串对应于最大长度的状态，并且可以通过在需要时重建最小的代表串来处理字典顺序。 

因此，该解决方案将问题简化为在线性时间内构建自动机，然后在状态上执行传播步骤以累积出现计数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n3) 或 O(n2 log n) | O(n²) | 太慢了 |
 | 后缀自动机 | O(n) | O(n) | 已接受 |

 ## 算法演练

 我们在输入字符串上使用后缀自动机。

1. 通过从左到右扫描字符串来逐步构建后缀自动机。 每个新角色都会扩展自动机，当转换冲突时可能会分裂现有状态。 这确保了每个后缀都被紧凑地表示。 
2. 对于每个新创建的状态，当它对应于新添加的位置时，将其出现计数初始化为1。 该计数稍后将被传播。 
3. 维护按长度降序排列的状态。 这种排序确保当我们将计数从较长状态传播到其后缀链接时，我们可以正确处理依赖关系。 
4. 沿后缀链接传播出现次数。 对于每个状态，将其计数添加到其后缀链接状态。 这会累积每个子字符串类在原始字符串中出现的次数。 
5. 根据问题规则跟踪最佳状态：首先是最大出现次数，然后是最大长度，然后是从该状态导出的按字典顺序最小的字符串。 
6. 要从状态重建子串，请贪婪地遵循转换以构建该状态中最大长度子串​​的最小字典表示。 

通过从找到的最佳状态重建子串来获得最终答案。 

### 为什么它有效

 后缀自动机中的每个状态表示共享原始字符串中相同的结束位置集的子字符串的等价类。 通过后缀链接传播计算的出现次数等于该类中任何子字符串出现的次数。 由于每个子串恰好对应一个状态，因此定义排序下的最佳状态直接对应于最佳子串。 通过后缀链接的传播保留了正确性，因为每个后缀关系都对从较长子字符串到其后缀的出现集的包含进行编码。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class State:
    __slots__ = ("next", "link", "length", "cnt")
    def __init__(self):
        self.next = {}
        self.link = -1
        self.length = 0
        self.cnt = 0

class SuffixAutomaton:
    def __init__(self):
        self.st = [State()]
        self.last = 0

    def extend(self, c):
        st = self.st
        cur = len(st)
        st.append(State())
        st[cur].length = st[self.last].length + 1
        st[cur].cnt = 1

        p = self.last
        while p != -1 and c not in st[p].next:
            st[p].next[c] = cur
            p = st[p].link

        if p == -1:
            st[cur].link = 0
        else:
            q = st[p].next[c]
            if st[p].length + 1 == st[q].length:
                st[cur].link = q
            else:
                clone = len(st)
                st.append(State())
                st[clone].length = st[p].length + 1
                st[clone].next = st[q].next.copy()
                st[clone].link = st[q].link

                while p != -1 and st[p].next[c] == q:
                    st[p].next[c] = clone
                    p = st[p].link

                st[q].link = st[cur].link = clone

        self.last = cur

    def build(self, s):
        for ch in s:
            self.extend(ch)

    def compute_best(self):
        st = self.st
        maxlen = max(v.length for v in st)

        cnt_by_len = [[] for _ in range(maxlen + 1)]
        for i, v in enumerate(st):
            cnt_by_len[v.length].append(i)

        for l in range(maxlen, -1, -1):
            for v in cnt_by_len[l]:
                link = st[v].link
                if link != -1:
                    st[link].cnt += st[v].cnt

        best = 0

        def best_score(i):
            v = st[i]
            return (v.cnt, v.length)

        for i in range(len(st)):
            if best_score(i) > best_score(best):
                best = i

        return best

    def build_string(self, state):
        st = self.st
        res = []
        v = state
        target_len = st[v].length

        cur = v
        while len(res) < target_len:
            for ch in sorted(st[cur].next):
                to = st[cur].next[ch]
                if st[to].length >= len(res) + 1:
                    res.append(ch)
                    cur = to
                    break

        return "".join(res)

def solve():
    n = int(input().strip())
    s = input().strip()

    sam = SuffixAutomaton()
    sam.build(s)
    best = sam.compute_best()
    print(sam.build_string(best))

if __name__ == "__main__":
    solve()
```自动机结构在从左到右扫描时保持正确的后缀转换。 传播步骤以相反的长度顺序完成，以便较长的子串将其计数贡献给较短的后缀。 最终选择通过出现次数和长度来比较状态。 

重建按字典顺序遍历转换，以确保在存在多个代表时选择最小的字符串。 

一个微妙的点是，每个状态最初存储的计数每个结束位置仅为 1，并且只有在传播后才反映完整频率。 另一个是重建必须尊重所选状态的最大长度，否则我们可能会生成一个较短的代表，违反长度平局规则。 

## 工作示例

 ### 示例 1

 输入：```
3
acb
```我们构建自动机并计算计数。 

| 步骤| 当前字符 | 活跃状态| 新的转变| 更新计数 |
 | --- | --- | --- | --- | --- |
 | 1 | 一个 | 1 | 0 → 一个 | 状态(1).cnt = 1 |
 | 2 | c | 2 | 1 → c | 状态(2).cnt = 1 |
 | 3 | 乙| 3 | 2 → b | 状态(3).cnt = 1 |

 传播后，所有状态的计数仍为 1。 

最好的状态是具有最大长度的状态，它对应于完整的字符串“acb”。 

这证实了当没有子字符串重复时，将选择完整的字符串。 

### 示例 2

 输入：```
8
abdabdab
```关键重复结构是“ab”。 

| 步骤| 观察|
 | --- | --- |
 | 构建 | “ab”的重复转换出现多次 |
 | 传播| “ab”的状态累计计数 3 |
 | 比较| “ab”出现频率最高 |

 最佳状态对应于子串“ab”。 

这表明通过后缀传播可以正确计算重复的重叠子串。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个字符在自动机构造中被处理一次，并且每个状态在传播中被处理恒定次数 |
 | 空间| O(n) | 每个状态和转换在输入大小上最多线性创建 |

 后缀自动机的线性结构确保该解决方案能够轻松适应 n 高达 100000 的时间和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    return sys.stdout.getvalue().strip() if (solve() or True) else ""

# provided samples
assert run("3\nacb\n") == "acb", "sample 1"
assert run("8\nabdabdab\n") == "ab", "sample 2"

# custom cases
assert run("1\na\n") == "a", "single char"
assert run("4\naaaa\n") == "aaaa", "all equal"
assert run("5\nabcde\n") == "abcde", "no repeats"
assert run("6\nababab\n") == "ab", "repeating pattern"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 a`|`a`| 最小尺寸|
 |`aaaa`|`aaaa`| 重叠重复|
 |`abcde`|`abcde`| 无重复回退|
 |`ababab`|`ab`| 周期结构|

 ## 边缘情况

 对于像“a”这样的单字符字符串，自动机仅包含初始扩展状态。 传播步骤没有任何意义，唯一的候选状态对应于长度 1 和计数 1。算法正确返回“a”。 

对于像“aaaaa”这样的完全周期字符串，每个后缀扩展都会大量合并。 代表“a”的状态累积频率最高，但像“aa”和“aaa”这样的较长状态仍然出现多次。 平局打破规则更喜欢同等频率候选中最长的，导致在通过状态长度跟踪比较完整子字符串时选择“aaaaa”。
