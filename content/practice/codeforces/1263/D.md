---
problem: 1263D
contest_id: 1263
problem_index: D
name: "Secret Passwords"
contest_name: "Codeforces Round 603 (Div. 2)"
rating: 1500
tags: ["dfs and similar", "dsu", "graphs"]
answer: passed_samples
verified: true
solve_time_s: 117
date: 2026-06-13
model: gpt-5-3-mini
samples_passed: 1
samples_total: 1
share_url: https://chatgpt.com/share/6a2d8071-ffa0-83ec-857d-abcaf5fc2df4
---

# CF 1263D - 秘密密码

 **评分：** 1500
 **标签：** dfs 和类似、dsu、图表
 **型号：** gpt-5-3-mini
 **求解时间：** 1m 57s
 **已验证：** 是（1/1 样品）
 **分享：** https://chatgpt.com/share/6a2d8071-ffa0-83ec-857d-abcaf5fc2df4

 ---

 ## 解决方案

 ## 问题理解

 我们得到一个字符串集合，其中每个字符串代表一个密码。 系统并不将这些密码视为完全独立的。 相反，它定义了密码之间“等效”的概念：如果两个密码共享至少一个公共字符，或者如果它们可以通过一系列其他密码连接，其中每个相邻对共享一个字符，则两个密码是等效的。 

这很自然地将问题转化为有关连通性的推理。 每个密码都可以被视为图中的一个节点。 如果对应的字符串至少共享一个字母，则两个节点之间存在边。 那么，等价就是两个节点位于该图的同一连通分量中的陈述。 

实际上只有一个密码是正确的管理员密码，但不知道是哪一个。 如果我们选择一组密码进行尝试，那么尝试任何密码都会自动覆盖其等效类中的所有密码，因为它们都会导致相同的访问结果。 任务是选择最少数量的密码，以便无论哪个连接的组件包含管理员密码，至少有一个所选密码位于该组件中。 

更具体地说，我们需要从通过链接共享字母的密码形成的每个连接组件中选择至少一个代表。 

限制很大：最多 200,000 个字符串，总长度最多 1,000,000。 这立即排除了任何成对比较方法。 检查每对字符串的简单图结构将是密码数量的二次方，这太慢了。 即使将所有字符串相互比较也会超出时间限制。 

字母表只有 26 个小写字母，这是关键的结构限制。 每个密码只能通过这 26 个可能的“端口”进行连接，这强烈暗示了字母或由字母引起的连接组件上的联合结构。 

当存在重复项时，会出现微妙的边缘情况。 相同的字符串基本上是等效的，但它们也不应该被视为单独的组件。 另一个边缘情况是密码包含多个不同的字母，因为它可以一次连接多个字母组，从而合并其他单独的组件。 

## 方法

 暴力方法将显式地在密码之间构建图表。 我们比较每对字符串并检查它们是否共享一个字符。 如果他们这样做，我们就会联合他们或将他们联系起来。 检查一对需要最多 50 个字符比较，并且最多有$n^2$对，这导致大约$10^{10}$最坏情况下的操作。 这远远超出了任何可行的限度。 

关键的观察结果是，直接的密码与密码的比较是不必要的。 连接两个密码的唯一原因是共享字母的存在。 这意味着字母充当完全捕获连接性的中间表示。 

我们不考虑字符串之间的边，而是翻转图结构。 我们将每个字母视为一个节点，并将密码连接到它包含的所有字母。 那么当两个密码的字母集通过这些字母节点重叠时，它们就完全相等。 这允许我们在 26 个字母上使用不相交集并集 (DSU) 结构。 

每个密码有效地将其所有字符“连接”成一个连接的结构。 处理完所有密码后，字母形成多个连接的组件。 任何包含至少一个组件字母的密码都属于该组件。 因此，密码所涉及的不同字母组件的数量对应于连接的密码组的数量。 

最后，由于每一组都需要至少一个代表性密码，因此答案是由至少一个密码中出现的字母引起的不同连通分量的数量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力配对连接 | O(n²·26) | O(n²) | 太慢了|
 | DSU 字母 | O(总长度α(26)) | O(26) | 已接受 |

 ## 算法演练

 我们维护一个超过 26 个节点的 DSU，每个小写字母一个。 

1. 初始化 DSU，其中每个字母都是其自己的父字母。 这表示最初没有字母连接。 
2. 对于每个密码，提取其中出现的一组不同字符。 我们只关心字符串内部的唯一性，因为重复的字母不会改变连接性。 
3. 对于每个密码，将其第一个字符作为参考，并将其与同一密码中的所有其他字符合并。 此步骤将密码中的所有字母合并到一个连接的组件中，反映出该密码将它们链接起来。 
4. 对所有密码重复此操作，随着引入更多连接，逐渐合并字母组。 
5. 处理完所有密码后，我们扫描至少一个密码中出现的所有字母，并收集每个字母的代表父级。 
6. 这些字母中不同代表的数量就是答案，因为每个代表密码之间等价的连通分量。 

### 为什么它有效

 每个密码都强制其所有字符都属于一个等价类。 字母上的 DSU 保持了这些约束的传递闭包。 如果两个密码共享一个字符，它们都会将该字符合并到各自的集合中，这确保它们的字母集在 DSU 结构中相交。 这种交叉保证了通过共享字母连接的所有密码都折叠到同一个 DSU 组件中。 因此，每个 DSU 组件精确对应于一个等价类密码，并且为每个组件选择一个代表就足够且最少了。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.p = list(range(n))
        self.r = [0] * n

    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return
        if self.r[ra] < self.r[rb]:
            ra, rb = rb, ra
        self.p[rb] = ra
        if self.r[ra] == self.r[rb]:
            self.r[ra] += 1

def solve():
    n = int(input())
    dsu = DSU(26)

    used = set()

    for _ in range(n):
        s = input().strip()
        letters = list(set(s))

        for ch in letters:
            used.add(ord(ch) - 97)

        base = ord(letters[0]) - 97
        for ch in letters[1:]:
            dsu.union(base, ord(ch) - 97)

    comps = set()
    for c in used:
        comps.add(dsu.find(c))

    print(len(comps))

if __name__ == "__main__":
    solve()
```DSU 建立在固定的字母大小 26 之上。每个字符串在其字母之间提供并集，确保所有同时出现的字母都连接起来。 这`used`设置跟踪哪些字母实际出现在输入中，因为未使用的字母不应该对答案有贡献。 

一个微妙的点是在联合操作之前删除每个字符串内的重复字符。 如果没有这个，重复的字母可能会导致冗余联合，但不会导致正确性问题； 尽管如此，重复数据删除仍然简化了推理并最大限度地减少了操作。 

最后，仅对使用过的字母计算不同的 DSU 根可确保我们仅计算与实际密码相关的组件。 

## 工作示例

 ### 示例 1

 输入：```
4
a
b
ab
d
```我们跟踪 DSU 合并：

 | 密码 | 信件| 工会行动| DSU 组件（概念）|
 | ---| ---| ---| ---|
 | 一个 | {一} | 无 | {a}、{b}、{c}、... |
 | 乙| {b} | 无 | {a}，{b}，... |
 | ab | {a,b} | a-b | {a，b}，... |
 | d | {d} | 无 | {a,b}, {d}, ... |

 处理后，我们有两个连接的组件：一个包含 {a,b}，一个包含 {d}。 答案是 2，这意味着我们需要从每个组件中至少猜测一个。 

### 示例 2

 输入：```
3
abc
cde
f
```| 密码 | 信件| 工会行动| DSU 组件（概念）|
 | ---| ---| ---| ---|
 | ABC | {a,b,c} | a-b，a-c | {a,b,c} |
 | cDE | {c,d,e} | c-d，c-e | {a,b,c,d,e} |
 | f | {f} | 无 | 分开|

 处理后，{a,b,c,d,e} 是一个分量，{f} 是另一个分量，所以答案是 2。共享字母`c`是将前两个密码合并到一个等价类中的方法。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(总长度·α(26)) | 每个字符都参与固定字母表上的少量 DSU 联合 |
 | 空间| O(26) | 固定字母表上的 DSU 和辅助数组 |

 总长度限制确保最多一百万个字符，但由于字母大小固定，每个操作实际上都是恒定时间的，使得解决方案很容易足够快。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque

    class DSU:
        def __init__(self, n):
            self.p = list(range(n))
            self.r = [0] * n
        def find(self, x):
            while self.p[x] != x:
                self.p[x] = self.p[self.p[x]]
                x = self.p[x]
            return x
        def union(self, a, b):
            ra, rb = self.find(a), self.find(b)
            if ra == rb:
                return
            if self.r[ra] < self.r[rb]:
                ra, rb = rb, ra
            self.p[rb] = ra
            if self.r[ra] == self.r[rb]:
                self.r[ra] += 1

    n = int(sys.stdin.readline())
    dsu = DSU(26)
    used = set()

    for _ in range(n):
        s = sys.stdin.readline().strip()
        letters = list(set(s))
        for ch in letters:
            used.add(ord(ch) - 97)
        base = ord(letters[0]) - 97
        for ch in letters[1:]:
            dsu.union(base, ord(ch) - 97)

    comps = set(dsu.find(c) for c in used)
    return str(len(comps))

# provided sample
assert run("""4
a
b
ab
d
""") == "2"

# single string
assert run("""1
abc
""") == "1"

# all disjoint letters
assert run("""3
a
b
c
""") == "3"

# full chain connection
assert run("""3
ab
bc
cd
""") == "1"

# duplicates
assert run("""4
a
a
a
a
""") == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单串 | 1 | 最小案例|
 | a b c | 3 | 没有连接 |
 | cd | ab bc cd | 1 | 传递合并|
 | 所有一个 | 1 | 重复处理|

 ## 边缘情况

 当所有密码都是相同的单字符字符串时，例如`"a", "a", "a"`，该算法正确地将它们视为一个字母组成部分。 DSU 从未引入单节点之外的新结构，因此结果仍然为 1。 

当密码形成一条链时`"ab", "bc", "cd"`，第一个合并`a-b`，第二个合并`b-c`，第三个合并`c-d`。 DSU 确保所有字母合并为一个代表，从而产生一个等价类。 

当没有密码共享任何字母时，例如`"a", "b", "c"`，不执行并集，因此每个字母仍保留其自己的组成部分。 计算不同的根会得到三个，这与任何密码之间不存在等价性的事实相匹配。
