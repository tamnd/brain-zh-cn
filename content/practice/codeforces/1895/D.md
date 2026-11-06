---
title: "CF 1895D - 异或构造"
description: "我们得到了未知排列的连续元素之间的 XOR 值。 令所需的排列为$b$。 对于每个相邻的对，我们知道 $$bi oplus b{i+1} = ai.$$ 数组 $b$ 必须包含从 $0$ 到 $n-1$ 的每个整数恰好一次。"
date: "2026-06-08T21:46:38+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "constructive-algorithms", "data-structures", "math", "string-suffix-structures", "trees"]
categories: ["algorithms"]
codeforces_contest: 1895
codeforces_index: "D"
codeforces_contest_name: "Educational Codeforces Round 157 (Rated for Div. 2)"
rating: 1900
weight: 1895
solve_time_s: 169
verified: true
draft: false
---

[CF 1895D - 异或构造](https://codeforces.com/problemset/problem/1895/D)

 **评级：** 1900
 **标签：** 位掩码、构造算法、数据结构、数学、字符串后缀结构、树
 **求解时间：** 2m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了未知排列的连续元素之间的 XOR 值。 

设所需的排列为$b$。 对于每一个相邻的对，我们知道$$b_i \oplus b_{i+1} = a_i.$$数组$b$必须包含来自的每个整数$0$到$n-1$正好一次。 输入保证至少存在一种这样的排列。 

第一个观察结果是，一旦$b_1$是固定的，其他所有元素都被确定。 从$$b_2 = b_1 \oplus a_1,$$进而$$b_3 = b_2 \oplus a_2,$$等等。 整个数组是单个未知起始值的函数。 

约束条件$n \le 2 \cdot 10^5$立即排除任何二次方。 一个$O(n^2)$验证过程需要大约$4 \cdot 10^{10}$在最坏的情况下进行操作，远远超出了时间限制。 我们应该期待$O(n)$或者$O(n \log n)$解决方案。 

棘手的部分是找到正确的值$b_1$。 幼稚的实现可能会尝试每个可能的起始值并检查结果序列是否是排列。 这在概念上是可行的，但变得太慢了。 

一些边缘情况很容易被错误处理。 

考虑：```
n = 2
a = [1]
```有效的排列是$[0,1]$或者$[1,0]$。 一个解决方案假设$b_1=0$每当真正的起始值不同时，未经验证就会失败。 

考虑：```
n = 4
a = [2,1,2]
```如果我们选择$b_1=0$，我们得到```
0 2 3 1
```这是有效的。 但在很多输入中，选择$0$创建重复值。 生成的数字保持在一个小范围内这一事实并不意味着它们形成了排列。 

当 XOR 前缀重复时，会出现另一种微妙的情况：```
prefixes = [0, 5, 2, 5]
```粗心的争论可能会得出重复是不可避免的结论。 实际上，将每个前缀移位合适的 XOR 值会同时更改所有数字，并且重复项取决于所选的起始值。 正确的解决方案必须推理整套价值观，而不是个别立场。 

## 方法

 暴力破解的想法直接源于以下观察：$b_1$决定整个排列。 

定义前缀异或：$$p_1 = 0,$$和$$p_i = a_1 \oplus a_2 \oplus \cdots \oplus a_{i-1}.$$那么每个元素都满足$$b_i = b_1 \oplus p_i.$$如果我们尝试每一个可能的值$b_1$从$0$到$n-1$，我们可以生成所有$n$值并检查它们是否完全构成集合$\{0,1,\dots,n-1\}$。 

推理是正确的，因为每个有效的排列都必须来自这些起始值之一。 问题在于复杂性。 有$n$候选人$b_1$，以及每次验证成本$O(n)$，导致$O(n^2)$。 

关键的观察是输入保证有一个解决方案。 我们可以直接导出正确的开始，而不是测试所有可能的开始。 

让$$p_1,p_2,\dots,p_n$$是前缀 XOR 值$p_1=0$。 

自从$$b_i=b_1\oplus p_i,$$集合$$\{b_1\oplus p_i\}$$必须完全等于$$\{0,1,\dots,n-1\}.$$现在重点关注二进制 trie 的解释。 

对于候选值$x$，其中最大的数$$x \oplus p_i$$可以通过 trie 高效地找到。 如果结果集恰好是$[0,n-1]$，那么每个值都必须低于$n$。 因此$$\max_i (x \oplus p_i) < n.$$因为保证存在解，所以正确的起始值正是该值$x$与任何前缀的最大异或变为$n-1$。 

原始的 Codeforces 解决方案将所有前缀 XOR 插入二进制 trie 并查找值$x$其与集合的最大异或等于$n-1$。 该值变为$b_1$。 一次$b_1$众所周知，重建整个排列是立即的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^2)$|$O(n)$| 太慢了 |
 | 最佳 |$O(n \log V)$|$O(n \log V)$| 已接受 |

 这里$V$是最大可能的 XOR 值，如下所示$2^{18}$对于这个问题。 

## 算法演练

 1. 计算前缀异或。 

让$p_1=0$。 对于每个位置，附加所有先前位置的累积异或$a$-价值观。 
2. 将所有前缀异或插入到二进制特里树中。 

trie 允许我们回答最大异或查询$O(\log V)$。 
3. 对于每个值$x$从$0$到$n-1$, 查询 trie$$\max_i (x \oplus p_i).$$这是标准的最大异或查询。 
4.找到独特的价值$x$其最大异或等于$n-1$。 

因为最终的排列必须包含来自$0$到$n-1$，最大生成值恰好是$n-1$。 解的保证存在意味着正确的起始值满足此条件。 
5. 设置$b_1=x$。 
6. 使用重建排列$$b_i = x \oplus p_i.$$7. 输出结果序列。 

### 为什么它有效

 前缀 XOR 表示给出$$b_i=b_1\oplus p_i.$$因此，每个有效排列都是通过将整个前缀集异或移位单个值来获得的。 

认为$x=b_1$。 由于结果数字恰好是$\{0,\dots,n-1\}$，它们的最大值等于$n-1$。 因此$$\max_i(x\oplus p_i)=n-1.$$对于任何其他候选者，移位集不能等于所需的排列，因此最大异或值不同。 特里树使我们能够有效地识别正确的移位。 康复后$b_1$，每个剩余元素都遵循定义的 XOR 关系，因此重建的数组正是所需的排列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class TrieNode:
    __slots__ = ("ch",)

    def __init__(self):
        self.ch = [-1, -1]

trie = [TrieNode()]

def add(x):
    node = 0
    for bit in range(20, -1, -1):
        b = (x >> bit) & 1
        if trie[node].ch[b] == -1:
            trie[node].ch[b] = len(trie)
            trie.append(TrieNode())
        node = trie[node].ch[b]

def max_xor(x):
    node = 0
    ans = 0
    for bit in range(20, -1, -1):
        b = (x >> bit) & 1
        want = b ^ 1
        if trie[node].ch[want] != -1:
            ans |= 1 << bit
            node = trie[node].ch[want]
        else:
            node = trie[node].ch[b]
    return ans

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    pref = [0]
    cur = 0
    for x in a:
        cur ^= x
        pref.append(cur)

    for x in pref:
        add(x)

    start = 0
    for x in range(n):
        if max_xor(x) == n - 1:
            start = x
            break

    ans = [start ^ p for p in pref]
    print(*ans)

solve()
```第一部分构建前缀 XOR 数组。 关系$$b_i=b_1\oplus p_i$$是问题的核心结构事实，因此之后的所有内容都对前缀值进行操作。 

trie 存储所有前缀。 每个级别对应一位。 最大 XOR 查询尽可能贪婪地遵循相反的位，这是二进制 trie 中最大 XOR 的标准证明。 

遍历所有候选者$x \in [0,n-1]$搜索与前缀集的最大异或等于的起始值$n-1$。 问题保证保证了这样一个值的存在。 

最后，答案直接重构为$x \oplus p_i$。 无需额外验证。 

该实现使用 21 位，可以轻松涵盖问题中的所有值。 XOR 运算在 Python 中永远不会溢出，因此不存在整数大小问题。 

## 工作示例

 ### 示例 1

 输入：```
4
2 1 2
```前缀异或：

 | 步骤| 当前一个| 前缀异或|
 | --- | --- | --- |
 | 开始| - | 0 |
 | 1 | 2 | 2 |
 | 2 | 1 | 3 |
 | 3 | 2 | 1 |

 所以：```
pref = [0, 2, 3, 1]
```候选人搜索：

 | x| max(x XOR pref[i]) | 最大 (x XOR pref[i]) |
 | --- | --- |
 | 0 | 3 |
 | 1 | 3 |
 | 2 | 2 |
 | 3 | 3 |

 第一个有效选择是$x=0$。 

重建：

 | 我| 首选项[i] | b[i] = 0 异或 pref[i] |
 | --- | --- | --- |
 | 1 | 0 | 0 |
 | 2 | 2 | 2 |
 | 3 | 3 | 3 |
 | 4 | 1 | 1 |

 输出：```
0 2 3 1
```该轨迹演示了整个排列只是前缀 XOR 集的移位版本的核心思想。 

### 示例 2

 输入：```
2
1
```前缀异或：

 | 步骤| 前缀异或|
 | --- | --- |
 | 开始| 0 |
 | [1] | 之后 1 |

 所以：```
pref = [0, 1]
```候选人搜索：

 | x| max(x XOR pref[i]) | 最大 (x XOR pref[i]) |
 | --- | --- |
 | 0 | 1 |
 | 1 | 1 |

 选择$x=0$。 

重建：

 | 我| 首选项[i] | 结果 |
 | --- | --- | --- |
 | 1 | 0 | 0 |
 | 2 | 1 | 1 |

 输出：```
0 1
```此示例显示了尽可能小的输入，并确认即使仅存在一个 XOR 约束，重建公式也能发挥作用。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \log V)$| 每次前缀插入和每次查询都会遍历所有 trie 级别 |
 | 空间|$O(n \log V)$| 存储所有前缀时创建的 Trie 节点 |

 对于这个问题，$V$下面是$2^{21}$， 所以$\log V$实际上是一个小常数。 和$n \le 2 \cdot 10^5$，该解决方案很容易满足时间和内存的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    class TrieNode:
        __slots__ = ("ch",)

        def __init__(self):
            self.ch = [-1, -1]

    trie = [TrieNode()]

    def add(x):
        node = 0
        for bit in range(20, -1, -1):
            b = (x >> bit) & 1
            if trie[node].ch[b] == -1:
                trie[node].ch[b] = len(trie)
                trie.append(TrieNode())
            node = trie[node].ch[b]

    def max_xor(x):
        node = 0
        ans = 0
        for bit in range(20, -1, -1):
            b = (x >> bit) & 1
            want = b ^ 1
            if trie[node].ch[want] != -1:
                ans |= 1 << bit
                node = trie[node].ch[want]
            else:
                node = trie[node].ch[b]
        return ans

    n = int(input())
    a = list(map(int, input().split()))

    pref = [0]
    cur = 0
    for x in a:
        cur ^= x
        pref.append(cur)

    for x in pref:
        add(x)

    start = 0
    for x in range(n):
        if max_xor(x) == n - 1:
            start = x
            break

    ans = [start ^ p for p in pref]
    print(*ans)

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    global input
    input = sys.stdin.readline

    solve()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out.getvalue().strip()

# provided sample
assert run("4\n2 1 2\n") == "0 2 3 1"

# minimum size
assert run
```
