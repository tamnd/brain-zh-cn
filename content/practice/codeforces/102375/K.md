---
title: "CF 102375K - <<\u041a\u043e\u043d\u0442\u0430\u043a\u0442>>\u0434\u043b\u044f\u0434\u0432\u043e\u0438\u0445"
description: "我们有一本已知单词的字典。 对于每个查询，都会选择一个字典条目作为秘密单词（S），并且整数（K）决定第二个玩家在（S）的另一个字母被揭示之前可能会做出多少次不成功的猜测。"
date: "2026-08-12T22:43:29+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102375
codeforces_index: "K"
codeforces_contest_name: "\u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u0440\u0430\u0443\u043d\u0434 \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442\u0430 \u0421\u0435\u0432\u0435\u0440\u043e-\u0417\u0430\u043f\u0430\u0434\u0430 \u0420\u043e\u0441\u0441\u0438\u0438 \u0438 \u041c\u043e\u0441\u043a\u0432\u044b ICPC 2019"
rating: 0
weight: 102375
solve_time_s: 457
verified: true
draft: false
---

[CF 102375K - <<\u041a\u043e\u043d\u0442\u0430\u043a\u0442>>\u0434\u043b\u044f \u0434\u0432\u043e\u0438\u0445](https://codeforces.com/problemset/problem/102375/K)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一本已知单词的字典。 对于每个查询，都会选择一个字典条目作为秘密单词（S），并且整数（K）决定第二个玩家在（S）的另一个字母被揭示之前可能会做出多少次不成功的猜测。 

在任何时刻，玩家都知道 (S) 的前缀。 他们可以命名任何以前未使用的具有该前缀的字典单词。 秘密单词本身也在字典中，并且相同的拼写仍然是不同的字典条目，因此每次出现都必须单独计数。 

瓦莱拉想让游戏持续得尽可能久。 对于查询（（w，K）），所需的答案是最大可能的猜测次数，包括玩家最终猜出秘密单词时的成功猜测。 

所有字典单词的总长度最多为(2\cdot10^5)，可以有(2\cdot10^5)个查询。 这排除了为每个查询执行与整个字典成比例的工作。 当许多查询引用长单词时，即使预处理前缀计数但随后遍历每个查询的整个秘密单词的解决方案也可以达到大约 (2\cdot10^{10}) 次操作。 该解决方案必须使预处理与总输入大小基本呈线性，并使每个查询保持对数或接近对数。 

有几种边缘情况很容易被错误处理。 首先，秘密词可能是唯一具有第一个字母的词。 例如，```
1
a
1
1 1
```有答案`1`。 没有错误的猜测，因此玩家立即命名秘密单词。 仅计算不成功猜测的公式将错误地返回零。 

其次，重复的字典条目很重要。 考虑```
3
aa
ab
ab
2
2 2
```答案是`3`。 当（K=2）时，玩家可以先命名`aa`以及另一种情况的发生`ab`，然后第一个玩家透露整个单词是`ab`。 将字典视为一组会丢失一个可用的猜测并产生错误的结果。 

第三，以前命名的单词不能重复使用。 例如，```
4
abc
abd
abe
abf
2
1 2
```有答案`4`。 在第一轮比赛中，有两人`abd`,`abe`,`abf`必须被命名。 当前缀变成时，只剩下一个错误的单词`ab`，所以第二轮由错误的猜测和成功的猜测组成`abc`。 独立计算每个前缀下的单词数量会错误地假设相同的单词可以再次使用。 

## 方法

 最直接的方法就是模拟游戏。 对于每个查询，我们可以检查与当前已知前缀匹配的所有字典单词，选择合适的错误单词，将其从考虑中删除，在（K）猜测后显示下一个字母，然后继续。 这是正确的，因为唯一的策略选择是将哪些未使用的匹配词用作错误的猜测。 

一种文字实现，在每个前缀处扫描所有 (N) 个字典单词，一次查询的成本为 (O(N|S|))。 在给定的范围内，这可以对具有许多查询和长秘密单词的构造中的所有查询进行大约 (2\cdot10^{15}) 基本检查，因此它不可用。 

一个自然的改进是构建一个 trie 并存储通过每个前缀的字典条目数。 然后查询只能检查其秘密单词的前缀。 这将一次查询减少到 (O(|S|))，但 (2\cdot10^5) 查询仍然需要 (O(Q\cdot |S|)) 工作，这太大了。 

关键的观察是停止考虑单个单词，而是为每个错误的字典单词指定一个截止日期。 对于错误单词（T），令（d）为（T）和秘密单词（S）的最长公共前缀的长度。 该单词可以在第 (1,\ldots,d) 轮中猜出，但在第 (d) 个字母被揭示后，它不再是有效的猜测。 

如果游戏要继续下去，每一轮都需要恰好 (K) 个错误的猜测。 因此，问题变成了调度问题：每个错误的单词都是一个截止日期为（d）的作业，每轮有（K）个槽位。 玩家应该首先使用截止日期较早的单词，因为这些单词会更快消失。 

令(C_d)为与(S)的最长公共前缀长度至少为(d)的错误字典条目的数量。 在 trie 术语中，这只是具有 (S) 的前 (d) 个字母的字典条目的数量减去秘密条目本身。 

假设我们想要完成 (r) 整轮。 考虑最后 (r-d+1) 轮，从 (d) 到 (r)。 每个猜测都必须使用截止时间至少为 (d) 的单词，并且需要猜测 (K(r-d+1)) 个单词。 因此我们需要

 [
 C_d \ge K(r-d+1)
 ]

 对于每个 (d\le r)。 

这个条件也足够了。 截止日期至少为 (d) 的单词集是嵌套的，因此通常的贪婪调度参数适用：始终使用截止日期最小的可用单词。 后缀不等式正是该贪婪计划所需的容量条件。 

重新整理不等式可得

 [
 r \le d-1+\left\lfloor\frac{C_d}{K}\right\rfloor。 
]

 因此，完整回合的最大数量为

 [
 r=\min_d\left(d-1+\left\lfloor\frac{C_d}{K}\right\rfloor\right)。 
]

 最小值内的表达式有一个特别有用的形式：

 \left\lfloor\frac{C_d+K(d-1)}{K}\right\rfloor.
 ]

 对于固定的秘密词，每个深度（d）因此贡献一条线

 [
 f_d(x)=C_d+(d-1)x,
 ]

 并且查询要求这些线在 (x=K) 处的最小值。 这正是一个下凸包技巧问题。 我们为每个字典单词构建一次外壳，并通过对该外壳进行二分搜索来回答每个查询。 

在 (r) 轮完成后，如果 (r) 小于秘密长度，则下一轮不能包含 (K) 错误猜测。 令 (W=N-1) 为错误字典条目的总数。 此时仍然可用的错误单词的数量是

 [
 R=\min(C_{r+1}, W-rK)。 
]

 玩家说出这些（R）单词，然后成功命名秘密单词，所以最终答案是

 [
 rK+R+1。 
]

 如果 (r) 等于秘密长度，则所有回合均已完成，并且第一个玩家会揭示整个单词，因此答案很简单 (rK)。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 字面模拟 | (O(QN | S | )) 在最坏的情况下 | (O(N)) | 太慢了 |
 | Trie加模拟| (O(\sum | S | +Q | S | )) | (O(\sum | S | )) | 太慢了 |
 | Trie 加上凸包 | (O(L+Q\log L))，其中 (L) 是总字长 | (O(L)) | 已接受 |

 ## 算法演练

 1. 构建一个包含每个字典单词的 trie。 每个 trie 节点存储有多少个字典条目经过它。 相同的单词是单独插入的，因此它们的多重性会自动保留。 
2. 对于每个字典单词 (S)，遍历它在 trie 中的路径。 对于每个前缀长度 (d)，存储

 [
 C_d=\text{count(长度的前缀}d)-1。 
]

 减法删除了被选为秘密词的特定字典条目。 其他相同的条目仍然被计算在内，这正是游戏所需要的。 

1. 将每个错误单词解释为一个作业，其截止日期为其最长公共前缀长度（S）。 截止日期为 (d) 的单词可以在前 (d) 轮中的任何一轮中被猜出。 值 (C_d) 正是截止日期至少为 (d) 的作业数量。 
2. 对于每个前缀长度 (d)，创建行

 [
 y=C_d+(d-1)x。 
]

 对于查询值 (K)，最小行值除以 (K) 得出最大完整轮数：

 [
 r=\min\left(|S|,\left\lfloor\frac{\min_d(C_d+K(d-1))}{K}\right\rfloor\right)。 
]

 凸包只存储可以最优的线，因此可以在对数时间内找到最小值。 

1. 如果 (r=|S|)，则游戏每一轮都存活下来。 经过最后一轮的（K）猜测，所有字母都已揭晓，所以答案是（rK）。 
2.否则下一个已知前缀的长度为(r+1)。 该前缀下有 (C_{r+1}) 个错误的字典条目，但一些 (rK) 较早的猜测可能来自同一子树。 剩余可用错误单词的最小可能数量为

 [
 R=\min(C_{r+1},N-1-rK)。 
]

 玩家可以说出所有（R），然后必须说出秘密单词，所以答案是（rK+R+1）。 

1. 对每个请求的对 ((w,K)) 重复外壳查询。 单词的预处理独立于其他单词，因此重复的查询对不需要额外的工作。 

为什么它有效

 中心不变量是每个错误单词仅由它仍然可以被命名的最后一轮来表征，即它与秘密单词的最长公共前缀长度。 要完成 (r) 轮，最后 (r-d+1) 轮需要 (K(r-d+1)) 个单词，截止日期至少为 (d)。 不等式 (C_d\ge K(r-d+1)) 是必要的，并且由于符合条件的集合是嵌套的，因此它们足以满足总是首先花费最早截止日期的可用单词的贪婪策略。 凸包计算满足所有这些不等式的最大值 (r)。 一旦完成了这么多轮，(R) 的公式就会准确地计算出可以保留多少个可用的错误单词，之后如果游戏尚未结束，则秘密单词必然是下一个猜测。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def build_hull(values):
    hull = []

    for slope, intercept in enumerate(values):
        while len(hull) >= 2:
            m1, b1 = hull[-2]
            m2, b2 = hull[-1]
            m3, b3 = slope, intercept

            # l2 is redundant if the intersection of l1,l2
            # is not to the right of the intersection of l2,l3.
            if (b1 - b2) * (m3 - m2) <= (b2 - b3) * (m2 - m1):
                hull.pop()
            else:
                break

        hull.append((slope, intercept))

    return hull

def query_hull(hull, x):
    lo = 0
    hi = len(hull) - 1

    while lo < hi:
        mid = (lo + hi) // 2

        m1, b1 = hull[mid]
        m2, b2 = hull[mid + 1]

        if m1 * x + b1 <= m2 * x + b2:
            hi = mid
        else:
            lo = mid + 1

    m, b = hull[lo]
    return m * x + b

def solve():
    n = int(input())
    words = [input().strip() for _ in range(n)]

    children = [{}]
    count = [0]

    # Build the trie and count how many dictionary entries
    # pass through every node.
    for word in words:
        node = 0
        for ch in word:
            nxt = children[node].get(ch)
            if nxt is None:
                nxt = len(children)
                children[node][ch] = nxt
                children.append({})
                count.append(0)

            node = nxt
            count[node] += 1

    hulls = [None] * n
    prefix_counts = [None] * n

    # For every possible secret word, prepare C_d and its
    # lower hull of lines C_d + (d-1) * x.
    for idx, word in enumerate(words):
        node = 0
        values = []

        for ch in word:
            node = children[node][ch]
            values.append(count[node] - 1)

        prefix_counts[idx] = values
        hulls[idx] = build_hull(values)

    q = int(input())
    total_wrong = n - 1
    out = []

    for _ in range(q):
        w, k = map(int, input().split())
        w -= 1

        values = prefix_counts[w]
        length = len(values)
        hull = hulls[w]

        minimum = query_hull(hull, k)
        rounds = minimum // k

        if rounds > length:
            rounds = length

        completed = rounds * k

        if rounds == length:
            out.append(str(completed))
            continue

        remaining = min(values[rounds], total_wrong - completed)
        answer = completed + remaining + 1
        out.append(str(answer))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```trie 构造遵循演练的第一部分。 单词的每次出现都会增加其完整前缀路径上的计数器，因此两个相同的拼写会产生两个单独的条目。 

对于每个单词，`values[d]`商店 (C_{d+1})。 该词本身被减去一次`count[node] - 1`，而具有相同拼写的其他词典条目仍然存在。`build_hull`接收斜率为 (0,1,2,\ldots) 的线。 叉积比较避免了浮点交集坐标。 由于所有值都是整数，并且可以大到大约 (K|S|)，因此整数运算自然也足够了。 Python 整数不存在溢出问题。`query_hull`比较两条相邻的船体线。 下壳使线值围绕其最小值排序，因此二分搜索在 (O(\log |S|)) 中找到最佳线。 

船体返回的表达式为

 [
 M=\min_d(C_d+K(d-1))。 
]

 用整数除法将其除以 (K) 即可得出完整轮次的最大数量。 这`rounds > length`Guard 处理最小表达式超过字母数的理论情况。 

最终计算使用`values[rounds]`， 因为`rounds`完整的回合意味着下一个已知前缀有长度`rounds + 1`，对应从零开始的索引`rounds`。 这`+1`最终答案是当游戏在所有字母都被揭示之前停止时成功猜出秘密单词。 

## 工作示例

 ### 示例 1

 考虑第一个字典单词`asassin`。 沿秘密路径的相关错误词计数为

 [
 C_1=5，\qquad C_2=2，\qquad C_3=0。 
]

 后面的前缀计数也为零，因此它们永远无法提高外壳最小值。 

对于 (K=1)，三个相关行是 (5)、(2+x) 和 (2x)。 (x=1) 处的最小值为 (2)，因此可能有两轮完整的回合。 下一个前缀没有错误的单词，因此秘密单词本身在第三次尝试时就被猜到了。 

| 前缀长度 (d) | (C_d) | 行 (C_d+(d-1)K), (K=1) |
 | --- | --- | --- |
 | 1 | 5 | 5 |
 | 2 | 2 | 3 |
 | 3 | 0 | 2 |

 因此 (r=2)，答案是 (2\cdot1+0+1=3)。 

对于 (K=2)，线值为 (5,4,4)。 最小值为 (4)，给出 (r=2)。 第三个前缀下又没有剩余的错误单词，所以答案是（4+1=5）。 

对于 (K=3)，线值为 (5,5,6)。 最小值为 (5)，给出 (r=1)。 经过第一轮的三次猜测后，第二个前缀下还剩下两个可用的错误词。 玩家说出这两个名字，然后猜测秘密单词。 

| (K) | 船体最小值| 完整回合 (r) | 剩下的错误猜测| 最终答案|
 | --- | --- | --- | --- | --- |
 | 1 | 2 | 2 | 0 | 3 |
 | 2 | 4 | 2 | 0 | 5 |
 | 3 | 5 | 1 | 2 | 6 |

 此跟踪说明了为什么以前使用的单词必须被视为计划作业，而不是在每个前缀处独立计数。 对于（K=3），第一轮消耗一些原本属于更深前缀的单词。 

### 示例 2

 取字典条目2，`ab`，作为秘密词。 prefix 下还有另外两个字典条目`a`:`aa`和第二次出现`ab`。 因此(C_1=2)。 完整前缀下`ab`，只有另一种情况出现`ab`仍然存在，所以（C_2=1）。 

对于 (K=1)，两条线具有值 (2) 和 (2)。 可以进行两轮完整的比赛。 

| 前缀长度 (d) | (C_d) | 行 (C_d+(d-1)K), (K=1) |
 | --- | --- | --- |
 | 1 | 2 | 2 |
 | 2 | 1 | 2 |

 球员的名字`aa`，然后第一个玩家揭示`b`。 玩家接下来命名对方`ab`，第一个玩家结束游戏，因为整个单词已经被揭示。 答案是`2`。 

对于 (K=2)，线值为 (2) 和 (3)，因此只能完成一轮。 经过这一轮的两次猜测，都没有错`ab`条目仍然存在，并且密码被成功猜出。 

| (K) | 船体最小值| 完整回合 (r) | 剩下的错误猜测| 最终答案|
 | --- | --- | --- | --- | --- |
 | 1 | 2 | 2 | 0 | 2 |
 | 2 | 2 | 1 | 0 | 3 |

 第二个查询演示了为什么重复的拼写必须保留单独的字典条目。 第二个`ab`是一个合理的错误猜测，即使它的拼写与秘密单词相同。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(L+Q\log L)) | Trie 构造和所有 Hull 构造均采用 (O(L))，其中 (L) 是所有单词的总长度。 每个查询执行一次二分查找。 |
 | 空间| (O(L)) | 特里树、前缀计数数组、凸包和存储的单词包含 (O(L)) 总信息。 |

 这里是 (L\le2\cdot10^5) 和 (Q\le2\cdot10^5)。 预处理与实际输入大小呈线性关系，而每个查询仅涉及属于其所请求单词的外壳。 最大的外壳受该单词的长度限制，因此对数查询范围仍然很小。 

## 测试用例```python
import sys
import io

def build_hull(values):
    hull = []

    for slope, intercept in enumerate(values):
        while len(hull) >= 2:
            m1, b1 = hull[-2]
            m2, b2 = hull[-1]
            m3, b3 = slope, intercept

            if (b1 - b2) * (m3 - m2) <= (b2 - b3) * (m2 - m1):
                hull.pop()
            else:
                break

        hull.append((slope, intercept))

    return hull

def query_hull(hull, x):
    lo = 0
    hi = len(hull) - 1

    while lo < hi:
        mid = (lo + hi) // 2

        m1, b1 = hull[mid]
        m2, b2 = hull[mid + 1]

        if m1 * x + b1 <= m2 * x + b2:
            hi = mid
        else:
            lo = mid + 1

    m, b = hull[lo]
    return m * x + b

def solve_stream(stream):
    input = stream.readline

    n = int(input())
    words = [input().strip() for _ in range(n)]

    children = [{}]
    count = [0]

    for word in words:
        node = 0

        for ch in word:
            nxt = children[node].get(ch)

            if nxt is None:
                nxt = len(children)
                children[node][ch] = nxt
                children.append({})
                count.append(0)

            node = nxt
            count[node] += 1

    hulls = [None] * n
    prefix_counts = [None] * n

    for idx, word in enumerate(words):
        node = 0
        values = []

        for ch in word:
            node = children[node][ch]
            values.append(count[node] - 1)

        prefix_counts[idx] = values
        hulls[idx] = build_hull(values)

    q = int(input())
    total_wrong = n - 1
    answer = []

    for _ in range(q):
        w, k = map(int, input().split())
        w -= 1

        values = prefix_counts[w]
        length = len(values)

        rounds = query_hull(hulls[w], k) // k
        rounds = min(rounds, length)

        completed = rounds * k

        if rounds == length:
            answer.append(str(completed))
        else:
            remaining = min(values[rounds], total_wrong - completed)
            answer.append(str(completed + remaining + 1))

    return "\n".join(answer)

def run(inp: str) -> str:
    return solve_stream(io.StringIO(inp)).strip()

# Provided sample 1
assert run("""\
6
asassin
assistant
astronaut
abrakadabra
abbey
automaton
9
1 1
1 2
1 3
4 1
4 2
4 3
6 1
6 2
6 3
""") == """\
3
5
6
3
4
5
2
3
4
""", "sample 1"

# Provided sample 2
assert run("""\
3
aa
ab
ab
6
1 1
2 1
1 2
3 2
2 2
3 1
""") == """\
2
2
3
3
3
2
""", "sample 2"

# Provided sample 3
assert run("""\
7
pit
pitbul
piter
pitstop
pitlane
petroleum
pistol
6
1 2
1 3
6 4
7 2
7 3
5 1
""") == """\
6
7
5
5
7
4
""", "sample 3"

# Minimum-size dictionary.
assert run("""\
1
a
1
1 1
""") == "1", "only word is the secret"

# Duplicate spellings and K at the boundary.
assert run("""\
3
aa
ab
ab
2
2 2
2 1
""") == """\
3
2
""", "duplicates must remain distinct"

# Previously used words cannot be reused.
assert run("""\
4
abc
abd
abe
abf
2
1 2
1 1
""") == """\
4
3
""", "reuse of guesses"

# Maximum-size construction: 200000 identical one-letter words.
maximum_case = (
    "200000\n"
    + "a\n" * 200000
    + "2\n"
    + "1 1\n"
    + "1 200000\n"
)

assert run(maximum_case) == """\
1
200000
""", "maximum N and duplicate count"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / a / 1 / 1 1`|`1`| 最少字典，立即猜中成功|
 | 三个条目`aa, ab, ab`|`3, 2`| 重复的字典条目和 (K) 边界行为 |
 |`abc, abd, abe, abf`|`4, 3`| 以前使用过的单词不得再次计算|
 | 200000份`a`|`1, 200000`| 最大 (N)、最大 (K) 和大重数 |

 ## 边缘情况

 对于单个单词的情况```
1
a
1
1 1
```trie 包含一个前缀节点`a`，其字典计数为 1。 减去秘密条目后，(C_1=0)。 外壳包含线 (y=0)，因此 (r=0)。 剩余错词为零，答案为（0+0+1=1）。 该算法正确地计算了成功的猜测。 

对于重复的拼写，```
3
aa
ab
ab
1
2 2
```的 trie 计数为`a`是三，所以(C_1=2)。 计数为`ab`是二，所以(C_2=1)。 当 (K=2) 时，外壳值为 (2) 和 (3)，得出 (r=1)。 经过前两次猜测，没有错`ab`条目仍然存在，因此接下来要猜测秘密词。 结果是(2+0+1=3)。 在整个预处理过程中都会保留重复出现的情况。 

对于不可重复使用的情况，```
4
abc
abd
abe
abf
1
1 2
```有 3 个错误的单词，并且都有相同的截止日期 (2)。 因此(C_1=3)和(C_2=3)。 对于 (K=2)，船体给出

 [
 \min(3,3+2)=3,
 ]

 所以（r=1）。 第一轮消耗了两个错误的单词。 在前缀处`ab`，只剩下一个错误的单词，所以第二轮有一个错误的猜测，然后是成功的猜测`abc`。 答案是（4）。 船体模型捕捉到了三个单词中的两个已经被消耗的事实。 

对于最大重复情况，有 (200000) 个副本`a`。 对于（K=1），秘密词可以被一个错误的猜测推迟，但是该词在这一轮之后已经完全被揭示，给出了答案`1`。 对于 (K=200000)，有 (199999) 个错误事件，然后可以命名秘密事件本身，准确给出`200000`。 该算法存储多重性而不是对字典进行重复数据删除，因此两种边界情况都能正确处理。
