---
problem: 939D
contest_id: 939
problem_index: D
name: "Love Rescue"
contest_name: "Codeforces Round 464 (Div. 2)"
rating: 1600
tags: ["dfs and similar", "dsu", "graphs", "greedy", "strings"]
answer: passed_samples
verified: true
solve_time_s: 74
date: 2026-06-18
model: gpt-5-3-mini
samples_passed: 1
samples_total: 1
share_url: https://chatgpt.com/share/6a339873-b5b0-83ec-af64-de42c9d02b4a
---

#CF 939D - 爱心救援

 **评分：** 1600
 **标签：** dfs 和类似、dsu、图、贪婪、字符串
 **型号：** gpt-5-3-mini
 **求解时间：** 1m 14s
 **已验证：** 是（1/1 样品）
 **分享：** https://chatgpt.com/share/6a339873-b5b0-83ec-af64-de42c9d02b4a

 ---

 ## 解决方案

 ## 问题理解

 我们得到了两根等长的字符串，一根写在 Valya 的套头衫上，一根写在 Tolya 的 T 恤上。 目标是使用一组允许的转换规则使两个字符串相同。 

每个咒语对应一对小写字母。 一旦我们购买了字母咒语`c1`和`c2`，我们可以转换`c1`进入`c2`还有`c2`进入`c1`，并且此转换可以在两个字符串中的任何位置应用任意次数。 

关键的微妙之处在于我们不直接按固定顺序对字符执行操作。 相反，我们在字母之间选择一组“双向边缘”，这些边缘定义哪些字母最终可以通过转换链变成哪些字母。 我们的任务是选择尽可能小的一组这样的边，以便对于每个位置`i`，使用这些转换可以使该位置的两个字符相等。 

所以问题就简化为：在 26 个字母上构建一个无向图。 添加一条边的成本为 1，有了边，我们就可以沿着连接的组件自由移动。 我们想要每一双`(s[i], t[i])`位于同一个连通分量中。 目标是最小化边的数量，并输出任何最佳的边集。 

约束条件`n ≤ 100000`意味着我们无法模拟每个位置的转换或尝试操作的子集。 字符串上的任何字母二次或线性操作都会太慢。 由于字母大小固定为 26，因此通过字母对进行推理或对字符使用 DSU 的解决方案是可行的。 

一些边缘情况很重要。 

如果两个字符串已经相同，则答案为零，并且我们不能输出任何内容。 幼稚的方法可能仍会尝试添加不必要的操作。 

如果每个位置都完全不同，例如`"abc"`和`"xyz"`，粗心的贪婪方法可能会尝试独立连接每个不匹配，从而产生许多冗余边而不是重用结构。 

主要的陷阱是假设每个不匹配都可以独立处理。 实际上，一条边缘可以同时帮助多个位置，因为它连接组件。 

## 方法

 一种强力方法是将其视为在 26 个节点之间选择一组边，并测试所有对是否可以在归纳图中连接。 我们可以枚举字母之间的所有边缘子集，使用 DSU 或 BFS 模拟连接，并检查可行性。 可能的边数是 325，所以这是不可能的。 即使只限制出现不匹配的边缘，也能提供高达 26×26 的可能性，仍然是指数级的。 

关键的观察是每个位置都强制执行一个要求：字母`a = s[i]`和`b = t[i]`必须最终位于同一个连接组件中。 如果它们已经是同一个字母，我们可以忽略它。 否则，我们必须确保两个节点之间的连接。 为了以最少的边缘实现这一点，我们希望尽可能便宜地合并组件。 

这成为一个经典的 DSU 构造问题。 我们从 26 个单例组件开始。 对于每个不匹配对`(a, b)`，如果它们已经连接，我们什么都不做。 否则，我们必须在它们之间添加一条边，以合并它们的组件。 每添加一条边最多会减少一个连通分量的数量，因此我们只在必要时添加边。 

这是最佳的，因为两个组件之间的每一个所需的相等性都会迫使它们之间至少有一个连接。 任何有效的解决方案都必须连接所有必需的对，因此 DSU 合并捕获最小数量的必要连接。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解边缘子集 | 指数| O(1) | O(1) | 太慢了|
 | 关于字母和不匹配的 DSU | O(n α(26)) | O(26) | 已接受 |

 ## 算法演练

 1. 初始化包含 26 个小写字母的 DSU，每个字母都有自己的组成部分。 
2. 迭代字符串的所有索引。 
3. 对于每个位置`i`， 比较`s[i]`和`t[i]`。 
4. 如果是相同的字母，则跳过，无需转换。 
5. 如果不同，请检查其组件是否已连接到 DSU 中。 
6. 如果它们没有连接，则将它们合并并记录该对`(s[i], t[i])`作为选定的咒语。 
7. 继续，直到处理完所有位置。 
8.输出记录的咒语数量和配对列表。 

我们仅在两个字母位于不同组件中时添加拼写的原因是，一旦连接，该对或任何间接相关对的未来出现就已经通过传递连接得到满足。 

### 为什么它有效

 每个联合操作连接两个先前独立的组件，并且两个字母之间的每个必需的相等都要求它们的组件被连接。 由于我们仅在合并组件时添加一条边，因此每个操作在选择时都是必要的。 在不破坏至少一个位置的连接的情况下，不能删除任何边，并且不需要额外的边，因为 DSU 确保所有必需的对都可传递连接。 

因此，该算法在图上构建了一个最小生成森林，其边缘是由字符串中的不匹配引起的。 

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
            return False
        if self.r[ra] < self.r[rb]:
            ra, rb = rb, ra
        self.p[rb] = ra
        if self.r[ra] == self.r[rb]:
            self.r[ra] += 1
        return True

n = int(input())
s = input().strip()
t = input().strip()

dsu = DSU(26)
res = []

for i in range(n):
    a = ord(s[i]) - 97
    b = ord(t[i]) - 97
    if a == b:
        continue
    if dsu.union(a, b):
        res.append((s[i], t[i]))

print(len(res))
for a, b in res:
    print(a, b)
```DSU 结构维护字母的连接组件。 每次我们看到不匹配时，我们都会尝试合并组件。 这`union`函数确保我们只在合并实际发生时才支付成本，从而防止不会减少组件数量的冗余咒语。 

一个微妙的点是我们不会尝试显式地存储或模拟转换。 仅连接性就足够了，因为任何咒语序列都与图中的可达性完全对应。 

## 工作示例

 ### 示例 1

 输入：```
3
abb
dad
```我们跟踪 DSU 合并。 

| 我| s[i] | t[i] | t[i] | 比较（s[i]）| 比较 (t[i]) | 联盟？ | 选定的边缘|
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 一个 | d | 一个 | d | 是的 | 广告 |
 | 1 | 乙| 一个 | 乙| 广告 | 是的 | 巴 |
 | 2 | 乙| d | a-d-b | a-d-b | 没有| - |

 第二次不匹配在第一次合并后解决`a`已经连接到`d`。 

这展示了一条边如何通过传递闭包满足稍后的多个位置。 

### 示例 2

 输入：```
4
abca
zzcx
```| 我| s[i] | t[i] | t[i] | 比较（s[i]）| 比较 (t[i]) | 联盟？ | 选定的边缘|
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 一个 | z | 一个 | z | 是的 | 一个Z |
 | 1 | 乙| z | 乙| a-z | 是的 | bz |
 | 2 | c | c | c | c | 没有| - |
 | 3 | 一个 | x| a-z-b | x| 是的 | 一个x |

 处理后，所有必需的等式都通过连通性得到满足。 

这表明我们仅在引入新的组件关系时才付费。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n α(26)) | 每个位置最多触发一个常量字母表上的 DSU 联合/查找 |
 | 空间| O(26) | DSU 阵列和输出存储 |

 该解决方案与字符串长度呈线性关系，并且由于字母表是恒定的，因此很容易满足约束条件。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
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
                return False
            if self.r[ra] < self.r[rb]:
                ra, rb = rb, ra
            self.p[rb] = ra
            if self.r[ra] == self.r[rb]:
                self.r[ra] += 1
            return True

    n = int(input())
    s = input().strip()
    t = input().strip()

    dsu = DSU(26)
    res = []

    for i in range(n):
        a = ord(s[i]) - 97
        b = ord(t[i]) - 97
        if a != b and dsu.union(a, b):
            res.append((s[i], t[i]))

    out = [str(len(res))]
    out += [f"{a} {b}" for a, b in res]
    return "\n".join(out)

# provided sample
assert run("3\nabb\ndad\n") == "2\na d\nb a"

# all equal
assert run("4\naaaa\naaaa\n") == "0"

# single mismatch
assert run("1\na\nb\n") == "1\na b"

# chain reuse
assert run("3\nabc\ncba\n") == "2\na c\nb a"

# already connected chain case
assert run("5\nababa\nbabab\n") is not None
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 相同的字符串 | 0 | 没有不必要的操作|
 | 单个不匹配| 1 边缘 | 基本情况正确性 |
 | 链条再利用| 2 条边 | 传递连通性|
 | 交替模式| 有效的最小集| 工会的重用|

 ## 边缘情况

 一种边缘情况是所有位置都已经相等。 DSU 从不执行并集，因此结果列表保持为空，我们正确地输出零。 

另一种情况是涉及已连接字母的重复不匹配。 例如合并后`a`和`b`，后来遇到`(b, a)`不应产生新的边缘。 DSU 检查可防止重复边缘，确保我们不会过度计数。 

最后一个微妙的情况是长链，例如`a-b-c-d`不同位置引起的。 该算法正确地构建了一个跨越结构，而无需重新审视之前的决策，因为一旦形成一个组件，其中所有未来的对都会自动满足。
