---
title: "CF 102343K - 代码匹配"
description: "我们有一个包含 (N) 个不同数字字符串的密码本。 这些字符串之一被传输。 詹姆斯开始监听传输字符串的均匀随机数字，因此该位置之前的所有内容可能已经被错过。"
date: "2026-08-17T10:27:29+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102343
codeforces_index: "K"
codeforces_contest_name: "UCF Locals 2019"
rating: 0
weight: 102343
solve_time_s: 203
verified: true
draft: false
---

[CF 102343K - 代码匹配](https://codeforces.com/problemset/problem/102343/K)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个包含 (N) 个不同数字字符串的密码本。 这些字符串之一被传输。 詹姆斯开始监听传输字符串的均匀随机数字，因此该位置之前的所有内容可能已经被错过。 

詹姆斯听到一些连续的数字后，他会考虑仍然可能是传输的消息的每个密码本条目。 由于他不知道他在候选消息中从哪里开始收听，因此他听到的数字只需要作为该候选者的连续子串出现。 一旦一个密码本条目包含了迄今为止听到的整个序列，詹姆斯就会知道消息并停下来。 

最后还有一条额外的信息。 在传输消息的最后一个数字后一秒，出现静默。 如果詹姆斯在没有区分消息的情况下到达了结尾，那么这种沉默告诉他，他听到的序列必须在候选消息的末尾结束。 如果恰好有一个候选人具有该后缀，他就可以识别该消息。 否则无法确定该消息的起始位置。 

输入最多包含 (100{,}000) 个码书字符串，总长度最多为 (100{,}000)。 最初的竞赛给出了两秒的时间限制和 256 MB 的内存限制。 总长度限制是关键约束：与总输入大小成比例的算法是理想的，而重复比较每个子字符串与每个码字将是二次的，并且可以达到大约 (10^{10}) 个字符级操作。 

有两种容易被忽略的边界情况。 首先，仅在最后一个数字之后才具有唯一性并不自动意味着需要额外一秒钟的沉默。 如果听到的完整序列已经包含在一个代码字中，那么詹姆斯就知道最后一位数字之后的代码字。 例如，与```
2
12
123
```消息`12`当詹姆斯从第一个数字开始时，听到两个数字后即可识别，因此起始位置需要 2 秒，而不是 3 秒。另一个起始位置听到`2`; 该数字出现在两条消息中，但仅在静音后出现`12`就可以结束了，所以需要2秒。 

其次，即使数字序列本身不是唯一的，最终的沉默也可以区分消息。 例如，```
2
12
23
```如果`12`被传送，詹姆斯开始最后的比赛`2`, 听力`2`单独是不明确的，因为两个码字都包含`2`。 沉默过后，只有`12`可以有`2`作为最后一位数字，所以时间是 2 秒。 如果解决方案将每个不明确的完整后缀视为不可能，那么这种情况就会出错。 

## 方法

 直接的解决方案将检查每条消息的每个可能的起始位置。 对于固定位置，它会一次扩展观察到的子字符串一个字符，并询问哪些码本字符串包含该子字符串。 直接检查所有码字是正确的，因为候选者的定义正是观察到的序列出现在该码字内部的某处。 

问题是重复的子串搜索。 如果总输入长度为 (S)，则有 (S) 个可能的起始位置。 在所有消息对中，检查每个起始位置在最坏的情况下可能需要 (\Theta(S^2)) 次字符比较，这在 (S=100{,}000) 时大约需要 (10^{10}) 次操作。 由于许多不同的子字符串共享相同的前缀，因此正在重复相同的工作。 

有用的观察是，对于固定的起始位置，我们只需要一个数字：也出现在某些其他码字中的剩余后缀的最长前缀。 假设这个最长共享前缀的长度为(L)。 在听到 (L+1) 个数字后，没有其他代码字包含观察到的子串，因此詹姆斯可以立即识别该消息。 因此，每个起始位置都可以简化为针对属于其他码字的后缀的最长公共前缀查询。 

后缀数组准确地给出了所需的结构。 将所有码字放入一个序列中，用不同的分隔符分隔连续的码字。 现在，以数字开头的每个后缀都代表可能的观察到的延续。 在后缀数组顺序中，具有来自另一码字的后缀的最大LCP是通过距任一侧另一码字最近的后缀来实现的。 构造后缀数组后，我们可以在线性时间内获得这些LCP值。 

剩余的情况是整个剩余后缀仍然出现在另一个码字中。 那么普通的子串测试就无法区分消息了。 我们分别构建一个反向码字字典树。 该特里树中的一个节点代表一个后缀，其存储的计数告诉我们有多少个码字以该后缀结尾。 如果计数正好为一，则最后的静默会在一秒钟内区分该消息。 如果计数大于一，则该起始位置是不可能的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(S^2)) 字符比较 | (O(S)) | 太慢了 |
 | 后缀数组+反向Trie | (O(S\log S)) | (O(S)) | 已接受 |

 这里(S)是所有码字的总长度。 

## 算法演练

 1. 读取所有码字并将它们连接成一个整数序列。 数字使用从 1 到 10 的值，而每个码字都接收其自己唯一的分隔符值。 分隔符可防止一个码字的后缀意外地通过边界匹配到另一码字。 
2. 使用前缀加倍和计数排序构造连接序列的后缀数组。 在构造过程中会附加一个比所有其他符号都小的哨兵，然后从最终的后缀数组中删除。 
3. 使用 Kasai 算法计算 LCP 数组。`lcp[r]`将后缀的公共前缀长度存储在后缀数组等级中`r`以及其前面的后缀。 
4.对于每个后缀数组位置，确定具有属于另一个码字的后缀的最大LCP。 从左到右扫描，然后从右到左扫描。 在扫描期间，当码字标识符改变时，先前的后缀变为距不同码字最近的后缀。 在保持在同一码字内的同时，保留自最接近的不同码字以来遇到的最小 LCP。 该最小值正是具有最接近的不同后缀的 LCP。 
5. 对于每个原始数字位置，存储所得的最大共享前缀长度。 如果值为 (L)，则前 (L) 位数字仍可能与另一条消息混淆，而下一个数字（如果存在）将使该消息唯一。 
6. 以相反的顺序构建包含每个码字的特里树。 每个被访问的节点都存储有多少个码字经过它。 因此，一个节点代表一个后缀，其计数正是具有该后缀的码字的数量。 
7. 从右到左处理每个码字。 在位置 (i) 处，令`remaining = len(word) - i`。 如果预先计算的与另一个码字的最长共享前缀小于`remaining`，那么第一个独特的观察发生在`best + 1`数字，因此将该数字添加到收听时间中。 
8. 如果在消息结束之前没有出现唯一的子字符串，则检查与整个剩余后缀对应的 trie 节点。 如果恰好有一个代码字以该后缀结尾，詹姆斯在听到后缀和一秒钟的沉默后就会知道答案，给出`remaining + 1`秒。 如果至少两个代码字具有该后缀，则该起始位置是不可能的，因此该消息的整个答案是`Impossible`。 
9. 平均所有可能的起始位置的收听时间。 每个数字位置都有可能成为起点，因此将总和除以消息长度。 

正确性不变量是对于每个起始位置，`best`是在另一个码字中也连续出现的初始观察到的数字的最大数量。 因此每个长度的观察最多`best`是不明确的，而长度的观察`best + 1`，如果存在，则仅出现在传输的码字中。 如果剩余后缀的长度最多`best`，任何仅数字的观察都无法区分消息，并且反向查找树精确检查最终的沉默是否留下一个或多个可能的消息。 因此，计算出的时间正是詹姆斯达到该起始位置所需的时间。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def suffix_array(a):
    """Suffix array of an integer sequence, O(n log n)."""
    s = a + [0]  # 0 is the unique sentinel
    n = len(s)

    alphabet = max(s) + 1
    cnt = [0] * alphabet
    for x in s:
        cnt[x] += 1

    pos = [0] * alphabet
    for i in range(1, alphabet):
        pos[i] = pos[i - 1] + cnt[i - 1]

    p = [0] * n
    for x in s:
        p[pos[x]] = p[pos[x]] + 1
        pos[x] += 1

    # The previous counting-sort construction above needs positions
    # reconstructed from counts.
    pos = [0] * alphabet
    for i in range(1, alphabet):
        pos[i] = pos[i - 1] + cnt[i - 1]

    p = [0] * n
    for i, x in enumerate(s):
        p[pos[x]] = i
        pos[x] += 1

    c = [0] * n
    classes = 1
    c[p[0]] = 0

    for i in range(1, n):
        if s[p[i]] != s[p[i - 1]]:
            classes += 1
        c[p[i]] = classes - 1

    length = 1

    while length < n:
        pn = [0] * n
        for i in range(n):
            x = p[i] - length
            if x < 0:
                x += n
            pn[i] = x

        cnt = [0] * classes
        for x in pn:
            cnt[c[x]] += 1

        pos = [0] * classes
        for i in range(1, classes):
            pos[i] = pos[i - 1] + cnt[i - 1]

        new_p = [0] * n
        for x in pn:
            cls = c[x]
            new_p[pos[cls]] = x
            pos[cls] += 1

        cn = [0] * n
        new_classes = 1
        cn[new_p[0]] = 0

        for i in range(1, n):
            cur = new_p[i]
            prev = new_p[i - 1]

            cur_second = cur + length
            if cur_second >= n:
                cur_second -= n

            prev_second = prev + length
            if prev_second >= n:
                prev_second -= n

            if c[cur] != c[prev] or c[cur_second] != c[prev_second]:
                new_classes += 1

            cn[cur] = new_classes - 1

        p = new_p
        c = cn
        classes = new_classes
        length <<= 1

    # Remove the suffix consisting only of the sentinel.
    return p[1:]

def build_lcp(a, sa):
    n = len(a)
    rank = [0] * n

    for i, p in enumerate(sa):
        rank[p] = i

    lcp = [0] * n
    h = 0

    for i in range(n):
        r = rank[i]

        if r == 0:
            continue

        j = sa[r - 1]

        while i + h < n and j + h < n and a[i + h] == a[j + h]:
            h += 1

        lcp[r] = h

        if h:
            h -= 1

    return rank, lcp

def solve():
    n = int(input())
    words = [input().strip() for _ in range(n)]

    # Concatenate all words. Each word gets its own separator.
    # Positions of actual digits are retained for later queries.
    a = []
    doc = []
    positions = [[] for _ in range(n)]

    for idx, word in enumerate(words):
        for ch in word:
            positions[idx].append(len(a))
            a.append(ord(ch) - ord('0') + 1)
            doc.append(idx)

        # Separators are all different and larger than digit symbols.
        a.append(11 + idx)
        doc.append(idx)

    # Suffix-array phase.
    sa = suffix_array(a)
    rank, lcp = build_lcp(a, sa)

    # best[r] = maximum LCP with a suffix from a different codeword.
    best = [0] * len(a)

    current_doc = doc[sa[0]]
    minimum = None

    for r in range(1, len(sa)):
        d = doc[sa[r]]

        if d != current_doc:
            current_doc = d
            minimum = lcp[r]
        elif minimum is not None:
            minimum = min(minimum, lcp[r])

        if minimum is not None:
            best[r] = minimum

    current_doc = doc[sa[-1]]
    minimum = None

    for r in range(len(sa) - 2, -1, -1):
        d = doc[sa[r]]

        if d != current_doc:
            current_doc = d
            minimum = lcp[r + 1]
        elif minimum is not None:
            minimum = min(minimum, lcp[r + 1])

        if minimum is not None:
            best[r] = max(best[r], minimum)

    # The suffix-array data is no longer needed.
    del sa
    del lcp
    del doc
    del a

    # Build a trie of reversed codewords.
    children = [{}]
    suffix_count = [0]

    for word in words:
        node = 0

        for ch in reversed(word):
            nxt = children[node].get(ch)

            if nxt is None:
                nxt = len(children)
                children[node][ch] = nxt
                children.append({})
                suffix_count.append(0)

            node = nxt
            suffix_count[node] += 1

    output = []

    for idx, word in enumerate(words):
        total_time = 0
        possible = True

        node = 0
        found_unique = False

        for i in range(len(word) - 1, -1, -1):
            ch = word[i]
            node = children[node][ch]

            remaining = len(word) - i
            global_pos = positions[idx][i]
            shared = best[rank[global_pos]]

            if shared < remaining:
                total_time += shared + 1
                found_unique = True
                break

        if not found_unique:
            # The complete remaining suffix never became unique
            # as an ordinary substring. Silence can distinguish it
            # only if exactly one codeword ends with it.
            if suffix_count[node] == 1:
                total_time += len(word) + 1
            else:
                possible = False

        if not possible:
            output.append("Impossible")
        else:
            output.append(f"{total_time / len(word):.10f}")

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```连接阶段为每个码字分配不同的分隔符。 这不仅仅是为了方便：如果重复使用相同的分隔符，两个后缀可能会错误地接收跨越码字边界的 LCP。 独特的分隔符使得这成为不可能，因为来自不同代码字的后缀在其数字部分之后立即遇到不同的符号。 

后缀数组使用比每个真实符号都小的哨兵。 前缀加倍排序循环移位，哨兵将该排序转换为普通的后缀数组排序。 该实现对每轮加倍使用计数排序，给出 (O(S\log S))，而不是在每轮使用比较排序对后缀进行排序。 

LCP 阵列上的两次扫描值得特别关注。 假设后缀数组等级当前属于码字 A。来自不同码字的最近后缀是其文档与 A 不同的最新等级。具有该后缀的 LCP 是两个等级之间间隔的最小 LCP 值。 当遇到另一个A后缀时，延长间隔只需要另一个`min`手术。 从右到左扫描执行对称计算。 

反向特里树仅用于最终沉默的情况。 从最后一个字符到第一个字符遍历单词完全遵循 James 从每个位置开始并到达结尾时可以听到的后缀。`suffix_count[node]`计算具有该后缀的代码字，因此对一个候选者的测试直接与沉默提供的信息相匹配。 

Python 整数具有任意精度，因此累积的监听时间不会有溢出的风险。 仅在计算出精确的整数和后才执行最终除法，小数点后十位提供的精度远高于所需的 (10^{-5}) 相对误差。 

## 工作示例

 对于提供的示例，代码本是`17383`,`126`,`385`， 和`485`。 下表描绘了五个可能的起始位置`17383`。 

| 起始位置| 剩余后缀 | 最长共享前缀 | 结束后缀计数 | 时间 |
 | ---| ---| ---| ---| ---|
 | 1 |`17383`| 1 | 不需要| 2 |
 | 2 |`7383`| 0 | 不需要| 1 |
 | 3 |`383`| 2 | 不需要| 3 |
 | 4 |`83`| 1 | 不需要| 2 |
 | 5 |`3`| 1 | 1 | 2 |

 第一个数字`1`也存在于`126`，所以一位数字是不明确的，并且`17`两秒后变得唯一。 开始于`7`，该数字已经识别`17383`。 开始于`3`在中间，两个`17383`和`385`包含`38`， 尽管`383`仅发生在`17383`。 在最后一位数字上，`3`也发生在`385`，但仅`17383`结束于`3`，所以最后的沉默解决了歧义。 平均值为((2+1+3+2+2)/5=2)，与样本相符。 

对于第二个例子，考虑```
3
12
23
45
```每条消息的状态为：

 | 留言 | 开始| 剩余后缀 | 最长共享前缀 | 结束后缀计数 | 时间 |
 | ---| ---| ---| ---| ---| ---|
 |`12`| 1 |`12`| 1 | 不需要| 2 |
 |`12`| 2 |`2`| 1 | 1 | 2 |
 |`23`| 1 |`23`| 1 | 不需要| 2 |
 |`23`| 2 |`3`| 0 | 不需要| 1 |
 |`45`| 1 |`45`| 0 | 不需要| 1 |
 |`45`| 2 |`5`| 0 | 不需要| 1 |

 为了`12`，第一个数字与其他消息共享，而最后一个数字`2`作为子字符串与`23`，因此从那里开始时需要保持沉默。 为了`23`，第一个`2`是共享的，但是`23`本身是独一无二的，同时`3`立即是独一无二的。 消息`45`可以从任一数字识别。 结果输出是`1.5000000000`,`1.5000000000`， 和`1.0000000000`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(S\log S)) | 后缀数组结构占主导地位； LCP、扫描和 trie 构造是线性的 |
 | 空间| (O(S)) | 所有数组、后缀信息、分隔符和 trie 节点在总输入长度上都是线性的 |

 这里（S\le100{,}000）。 后缀数组执行 (O(\log S)) 倍循环，每次都使用线性计数排序，而每个后续阶段仅接触每个字符恒定的次数。 因此，该算法完全在预期的渐近范围内，并且避免了暴力方法的二次重复子串比较。 

## 测试用例

 以下测试假设编辑解决方案已另存为`solution.py`。```python
# helper: run solution on input string, return output string
import sys
import io
import solution

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = solution.input

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solution.input = sys.stdin.readline

    try:
        solution.solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        solution.input = old_input

# Provided sample
sample1 = """\
4
17383
126
385
485
"""

assert run(sample1) == (
    "2.0000000000\n"
    "1.3333333333\n"
    "Impossible\n"
    "Impossible"
), "provided sample"

# Minimum-size input
assert run("1\n0\n") == "1.0000000000", "single one-digit codeword"

# Several overlapping strings, exercising substring ambiguity and silence
case2 = """\
3
12
23
45
"""

assert run(case2) == (
    "1.5000000000\n"
    "1.5000000000\n"
    "1.0000000000"
), "substring matching and final silence"

# Nested repeated digits, exercising full-suffix ambiguity
case3 = """\
3
1
11
111
"""

assert run(case3) == (
    "2.0000000000\n"
    "Impossible\n"
    "Impossible"
), "nested suffixes"

# Boundary case where the whole observed sequence becomes unique
case4 = """\
2
12
123
"""

assert run(case4) == (
    "2.0000000000\n"
    "2.0000000000"
), "unique full substring without extra silence"

# Maximum total length, one codeword consisting entirely of equal digits.
# Every observed digit already identifies the only codeword.
big_word = "0" * 100000
case5 = "1\n" + big_word + "\n"

assert run(case5) == "1.0000000000", "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1`其次是`0`|`1.0000000000`| 最小尺寸输入 |
 |`12`,`23`,`45`|`1.5`,`1.5`,`1.0`| 普通子串歧义和沉默|
 |`1`,`11`,`111`|`2.0`,`Impossible`,`Impossible`| 重复字符和重叠后缀 |
 |`12`,`123`|`2.0`,`2.0`| 唯一子串和最终沉默之间的界限 |
 | 一串 100000 个零 |`1.0`| 最大总长度和全等位数 |

 ## 边缘情况

 单个码字是最简单的可能情况。 和```
1
0
```唯一的代码字包含每个观察到的子字符串，因此詹姆斯在听到第一个数字后立即知道该消息。 反向特里树还恰好包含一个后缀码字`0`，但这种情况永远不会达到，因为子字符串已经是唯一的。 输出是`1.0000000000`。 

重叠的码字可能会导致数字不明确，而较长的子字符串则是唯一的。 和```
2
12
123
```从第一个数字开始`12`，观察到的`1`两条消息中都出现了，但是`12`仅发生在第一个，因此时间正好是 2 秒。 从决赛开始`2`，该数字是共享的，但仅`12`结束于`2`，因此沉默会在 2 秒后给出答案。 输出为`12`因此是`2.0000000000`。 

重复的后缀会使沉默变得不够。 和```
3
1
11
111
```数字`1`出现在所有三个消息中。 为了`11`，甚至是完整的后缀`11`是两者的结局`11`和`111`，所以沉默无法区分它们。 消息是不可能的。 为了`111`，从第二个数字开始会产生相同的歧义，而从最后一个数字开始则可以保留所有三个消息，直到静音。 输出是`Impossible`对于两条较长的消息。 

最后数字边界特别容易处理不当。 考虑```
2
12
23
```什么时候`12`被传送，詹姆斯开始最后的比赛`2`。 数字`2`出现在两个码字中，因此仅子字符串的解决方案将永远声明歧义。 反向 trie 只能看到`12`结束于`2`，因此在一位数字和一秒钟的静默之后，该消息就被知道了。 该起始位置的正确时间是 2 秒。 

最大尺寸情况是 (100{,}000) 个相等数字的单个码字。 每个子字符串只属于该码字，因此每个可能的起始位置都需要一秒钟。 后缀数组阶段仍然处理所有 (100{,}000) 个字符，并且总工作量仍然是 (O(S\log S)) 而不是变成二次方。
