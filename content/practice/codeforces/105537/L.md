---
title: "CF 105537L - 最长公共子串"
description: "给定两个字符串，我们想要确定两个字符串中出现的最长连续段的长度。 这里的连续段意味着子字符串，因此字符必须按顺序匹配并且没有间隙。"
date: "2026-06-27T01:01:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105537
codeforces_index: "L"
codeforces_contest_name: "2024-2025 ICPC NERC (NEERC), North-Western Russia Regional Contest (Northern Subregionals)"
rating: 0
weight: 105537
solve_time_s: 46
verified: true
draft: false
---

[CF 105537L - 最长公共子串](https://codeforces.com/problemset/problem/105537/L)

 **评级：** -
 **标签：** -
 **求解时间：** 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定两个字符串，我们想要确定两个字符串中出现的最长连续段的长度。 这里的连续段意味着子字符串，因此字符必须按顺序匹配并且没有间隙。 

输入由两行组成，每行包含一个字母表上的字符串。 输出是一个整数，表示两个字符串中某处存在的子字符串的最大长度。 

约束足够大，任何显式比较所有子字符串的方法都变得不可行。 如果两个字符串的长度都达到 10^5 左右，那么枚举所有子字符串就已经意味着每个字符串大约有 O(n^2) 个候选者，并且以简单的形式比较它们将爆炸到至少 O(n^3)。 即使是依赖于散列但仍迭代所有对的优化子字符串比较，在最坏的情况下也会太慢。 

这立即表明该解决方案必须避免显式枚举子字符串，而是依赖于压缩重复子字符串比较的结构。 

在实践中，一些边缘情况很重要。 如果一个字符串为空，则答案为零。 如果字符串不共享公共字符，则答案也为零，即使两者都很长。 如果字符串相同，则答案是字符串的完整长度。 一个更微妙的情况是重复字符，例如`"aaaaa"`和`"aaa"`，其中答案是最小长度，除非小心处理，否则简单的子字符串匹配很容易过度计算重叠。 

## 方法

 蛮力的想法很简单。 我们生成第一个字符串的每个子字符串和第二个字符串的每个子字符串，并比较它们以找到最长的匹配。 即使我们尝试使用哈希来优化比较，子字符串的数量仍然是二次的，因此我们最终会得到每个字符串大约 O(n^2) 个子字符串和每对 O(1) 或 O(log n) 比较，具体取决于实现。 这很快就会变得太大。 

一种稍微好一点的粗暴方法是固定一对起始位置，每个字符串中一个，并在字符匹配时进行扩展。 对于每一对，我们都会增加一个匹配窗口。 这是正确的，因为任何公共子串都必须对应于一些对齐的起始位置。 然而，这仍然检查 O(n^2) 对，并且在最坏的情况下可以扩展到每对 O(n)，从而在对抗性输入（如重复字符）上产生 O(n^3) 行为。 

关键的观察是，我们可以将问题视为找到两个字符串的所有后缀之间的最长公共前缀，而不是独立检查每个子字符串。 如果我们考虑第一个字符串的每个后缀和第二个字符串的每个后缀，那么任何公共子字符串正是某对后缀的公共前缀。 这将问题转化为寻找所有后缀对上的最大 LCP 值。 

后缀数组或后缀自动机自然捕获所有后缀及其关系。 后缀自动机方法在这里特别干净。 后缀自动机紧凑地表示字符串的所有子串，每个状态对应于一组具有相同结束位置的子串。 当我们通过从第一个字符串构建的自动机扫描第二个字符串时，我们可以跟踪在第一个字符串中出现的每个位置处结束的最长子字符串。 

这减少了将所有子串对与第二串上的单个线性扫描进行比较的问题，同时保持自动机中的当前匹配状态。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n3) | O(1) | O(1) | 太慢了 |
 | 后缀自动机 | O(n) | O(n) | 已接受 |

 ## 算法演练

 我们为第一个字符串构建一个后缀自动机，然后模拟在该自动机上遍历第二个字符串，同时跟踪在每个位置结束的最长有效匹配。 

1. 从第一个字符串构建后缀自动机。 每个状态存储字符的转换、后缀链接以及该状态表示的子字符串的最大长度。 该结构将第一个字符串的所有子字符串压缩为 O(n) 状态。 
2.初始化两个变量，`state`指向初始自动机状态并且`length`表示当前匹配的子串长度。 
3. 从左到右迭代第二个字符串的每个字符。 
4. 如果使用当前字符从当前状态发生转换，则跟随它并增加`length`一个。 这意味着我们已经扩展了第一个字符串中存在的有效子字符串。 
5. 如果没有这样的转换，我们会重复跟踪后缀链接，直到找到与当前字符有转换的状态或到达根。 在这样做的同时，我们也减少了`length`相应地，因为我们正在缩短匹配的后缀，直到它再次有效。 
6. 如果我们在回退后找到有效的转换，则将其获取并设置`length`到该过渡状态的长度加一。 如果没有，请重置`state`和`length`为零。 
7. 跟踪最大值`length`在第二个字符串中的所有位置上。 这个值就是答案。 

回退步骤是必要的，因为当前匹配仅在对应于第一个字符串中的子字符串时才有效。 当发生不匹配时，我们必须找到当前子串中仍然出现在自动机中的最长后缀。 

### 为什么它有效

 后缀自动机将第一个字符串的每个子字符串编码为从根开始的路径。 在扫描第二个字符串期间的任何时刻，算法都会保持以下不变式：`length`对应于第二个字符串的已处理前缀的最长后缀，该第二个字符串也是第一个字符串的子字符串，并且`state`是表示该子串的自动机状态。 每当发生不匹配时，后面的后缀链接都会按长度递减顺序有效地删除当前子字符串左侧的字符，直到再次存在有效的转换。 因为后缀链接代表最长的正确后缀，也是自动机意义上的前缀，所以这保证了我们永远不会跳过有效的候选子字符串，也永远不会高估匹配长度。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class State:
    __slots__ = ("next", "link", "length")
    def __init__(self):
        self.next = {}
        self.link = -1
        self.length = 0

def build_sa(s):
    st = [State()]
    last = 0

    for ch in s:
        cur = len(st)
        st.append(State())
        st[cur].length = st[last].length + 1

        p = last
        while p != -1 and ch not in st[p].next:
            st[p].next[ch] = cur
            p = st[p].link

        if p == -1:
            st[cur].link = 0
        else:
            q = st[p].next[ch]
            if st[p].length + 1 == st[q].length:
                st[cur].link = q
            else:
                clone = len(st)
                st.append(State())
                st[clone].length = st[p].length + 1
                st[clone].next = st[q].next.copy()
                st[clone].link = st[q].link

                while p != -1 and st[p].next[ch] == q:
                    st[p].next[ch] = clone
                    p = st[p].link

                st[q].link = st[cur].link = clone

        last = cur

    return st

def longest_common_substring(s, t):
    sa = build_sa(s)

    v = 0
    l = 0
    best = 0

    for ch in t:
        if ch in sa[v].next:
            v = sa[v].next[ch]
            l += 1
        else:
            while v != -1 and ch not in sa[v].next:
                v = sa[v].link
            if v == -1:
                v = 0
                l = 0
                continue
            l = sa[v].length + 1
            v = sa[v].next[ch]

        if l > best:
            best = l

    return best

s = input().strip()
t = input().strip()
print(longest_common_substring(s, t))
```该解决方案首先在第一个字符串上构建后缀自动机。 每个状态都将转换存储在字典中、后缀链接以及该状态表示的子字符串的最大长度。 该构造确保第一个字符串的每个子字符串都对应于自动机中的某个路径。 

在扫描第二个字符串期间，我们维护当前状态和匹配长度。 如果我们可以使用当前字符进行扩展，我们就直接这样做。 否则，我们将遍历后缀链接，直到找到有效的转换或返回到根。 调整长度以反映自动机中仍然存在的最长有效后缀。 答案是本次扫描期间遇到的最大匹配长度。 

一个微妙的细节是当我们回退到根并且仍然无法转换时的重置行为。 如果不显式重置状态和长度，过时的匹配长度可能会错误传播并导致匹配计数过多。 

## 工作示例

 考虑`s = "ababc"`和`t = "babca"`。 

我们跟踪扫描的进展情况`t`。 

| 人物 | 状态转换 | 长度| 最佳|
 | --- | --- | --- | --- |
 | 乙| 根 → b | 1 | 1 |
 | 一个 | b → ba | 2 | 2 |
 | 乙| 巴 → 巴 | 3 | 3 |
 | c | bab→babc| 4 | 4 |
 | 一个 | 不匹配，回退到 | 1 | 4 |

 这演示了自动机如何贪婪地扩展匹配，并且仅在必要时回退，从而保留最长的有效子字符串。 

现在考虑`s = "aaaaa"`和`t = "aaa"`。 

| 人物 | 状态转换 | 长度| 最佳|
 | --- | --- | --- | --- |
 | 一个 | 延长| 1 | 1 |
 | 一个 | 延长| 2 | 2 |
 | 一个 | 延长| 3 | 3 |

 这种情况显示了重复的字符，其中自动机停留在高度可重用的区域并不断扩展匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | 每个字符被处理一次，并且后缀链接遍历在所有转换上摊销为线性时间 |
 | 空间| O(n) | 自动机存储线性数量的状态和转换 |

 构建成本与第一个字符串的大小呈线性关系，扫描成本与第二个字符串的大小呈线性关系。 这完全符合 10^5 以内的典型约束。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    s = inp.strip().split()
    if len(s) == 2:
        from sys import stdin
    import sys
    input = sys.stdin.readline

    class State:
        __slots__ = ("next", "link", "length")
        def __init__(self):
            self.next = {}
            self.link = -1
            self.length = 0

    def build_sa(s):
        st = [State()]
        last = 0
        for ch in s:
            cur = len(st)
            st.append(State())
            st[cur].length = st[last].length + 1
            p = last
            while p != -1 and ch not in st[p].next:
                st[p].next[ch] = cur
                p = st[p].link
            if p == -1:
                st[cur].link = 0
            else:
                q = st[p].next[ch]
                if st[p].length + 1 == st[q].length:
                    st[cur].link = q
                else:
                    clone = len(st)
                    st.append(State())
                    st[clone].length = st[p].length + 1
                    st[clone].next = st[q].next.copy()
                    st[clone].link = st[q].link
                    while p != -1 and st[p].next[ch] == q:
                        st[p].next[ch] = clone
                        p = st[p].link
                    st[q].link = st[cur].link = clone
            last = cur

        return st

    def solve(s, t):
        sa = build_sa(s)
        v = 0
        l = 0
        best = 0
        for ch in t:
            if ch in sa[v].next:
                v = sa[v].next[ch]
                l += 1
            else:
                while v != -1 and ch not in sa[v].next:
                    v = sa[v].link
                if v == -1:
                    v = 0
                    l = 0
                    continue
                l = sa[v].length + 1
                v = sa[v].next[ch]
            best = max(best, l)
        return str(best)

    s, t = inp.strip().split()
    return solve(s, t)

# provided samples
assert run("ababc babca") == "4", "sample 1"

# custom cases
assert run("a a") == "1", "single char match"
assert run("abc def") == "0", "no overlap"
assert run("aaaaa aaa") == "3", "repeated characters"
assert run("abcd abcd") == "4", "full match"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 一个 | 1 | 最小相同字符串|
 | abc 定义 | 0 | 没有公共子串 |
 | 啊啊啊| 3 | 重复字符压缩|
 | abcd abcd | abcd 4 | 完整字符串匹配 |

 ## 边缘情况

 对于空字符串或单字符字符串，自动机仍然可以正确运行，因为根状态要么没有转换，要么只有一个转换。 为了`"a"`和`"a"`，扫描紧随有效转换并产生长度 1。 

对于重复的字符串，例如`"aaaaa"`和`"aaa"`，每一步都保持在自动机的一个小周期内。 回退逻辑永远不会被触发，这证实了该算法不需要显式的子字符串枚举。 

例如，对于完全不相交的字母表`"abc"`和`"xyz"`，每个字符都会导致回退到根状态并立即重置匹配长度。 最佳值始终保持为零，因为任何转换都不会成功。
