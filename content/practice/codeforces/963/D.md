---
problem: 963D
contest_id: 963
problem_index: D
name: "Frequency of String"
contest_name: "Tinkoff Internship Warmup Round 2018 and Codeforces Round 475 (Div. 1)"
rating: 2500
tags: ["hashing", "string suffix structures", "strings"]
answer: passed_samples
verified: true
solve_time_s: 109
date: 2026-06-18
model: gpt-5-3-mini
samples_passed: 1
samples_total: 1
share_url: https://chatgpt.com/share/6a33a36d-603c-83ec-9659-5838d7876b75
---

# CF 963D - 字符串频率

 **评分：** 2500
 **标签：** 哈希、字符串后缀结构、字符串
 **型号：** gpt-5-3-mini
 **求解时间：** 1m 49s
 **已验证：** 是（1/1 样品）
 **分享：** https://chatgpt.com/share/6a33a36d-603c-83ec-9659-5838d7876b75

 ---

 ## 解决方案

 ## 问题理解

 我们得到一个固定的文本字符串，然后是许多独立的模式查询。 每个查询都会给出一个模式字符串和所需的频率。 对于每个查询，我们需要足够频繁地查看主字符串中包含该模式的所有子字符串，并在这些子字符串中选择最短的一个。 如果该模式在全局主字符串中出现的次数不够多，则答案是不可能的。 

关键对象不仅在于模式是否出现，还在于其出现在主字符串中的位置。 一旦我们知道了模式的所有起始位置，就可以通过选择连续出现的块并将窗口从块中的第一个出现延伸到块中的最后一个出现来确定。 答案是仍包含至少 k 次出现的最小可能跨度。 

这些限制迫使我们采用全局预处理策略。 模式长度之和最多为 10^5，并且最多有 10^5 个查询，因此每个查询重新计算模式匹配将超出时间和内存。 任何每次查询扫描主字符串的解决方案在最坏的情况下都会导致 O(n^2) 并立即失败。 

当模式很长但以重叠方式出现时，例如在“aaaaa”这样的字符串中，就会出现微妙的边缘情况。 “aaa”的出现严重重叠，最小窗口取决于如何将重叠计算为不同的出现。 当 k 为 1 时，会出现另一个问题，其中答案只是模式长度（如果存在的话），但假设不相交事件的天真的方法仍然可能会过度计数或放错边界。 

## 方法

 直接的解决方案将通过扫描主字符串并收集所有出现的模式来单独处理每个查询。 然后，对于每个模式，我们获取其出现位置并计算覆盖 k 个连续出现的最小窗口。 这是正确的，因为任何包含 k 次出现的子字符串都必须包含按出现顺序排列的 k 个连续的子串。 问题是成本：在最坏的情况下，扫描每个查询的完整字符串会产生 O(|s| * n)，这大约是 10^10 次操作，并且不可行。 

关键的观察是所有模式都是预先已知的，并且它们的总长度很小。 这表明建立一个全局结构，可以同时回答许多模式的“这个模式出现在 s 中的哪里”。 具有 LCP 的后缀自动机或后缀数组可以工作，但这里最自然的适合是通过末端位置跟踪增强的后缀自动机。 

后缀自动机紧凑地表示 s 的所有子串，并允许我们在 O(|pattern|) 中定位与任何模式对应的状态。 每个状态代表一组子字符串的出现，并且通过后缀链接传播结束位置，我们可以收集每个匹配模式的所有出现索引。 一旦我们有了所有的出现，我们只需要计算覆盖 k 个连续排序位置的最佳窗口，这是排序列表上的简单滑动窗口最小值。 

因此，解决方案变为：构建 SAM，通过它提供每个查询字符串，检索该状态的所有结束位置，对它们进行排序，并计算覆盖 k 个连续出现的最小跨度。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 每个查询的强力扫描 | O( | s | · n) |
 | 后缀自动机 + 出现列表 | O( | s | + Σ |

 ## 算法演练

我们在主字符串上构造一个后缀自动机。 每个状态按字符、后缀链接和长度存储转换。 此外，每个状态都存储该状态的子字符串出现的结束位置列表。 我们在构造过程中通过标记每个前缀的终止状态并按状态长度的降序传播出现来填充这些列表。 

对于每个查询模式，我们逐个字符地遍历自动机。 如果在任何一步我们无法遵循转换，则该模式不存在，答案为 -1。 

如果我们成功到达某个状态，则该状态代表该模式的所有出现。 我们提取它的出现列表，其中包含字符串中所有匹配项的结束位置。 从每个结束位置我们得出模式出现的开始位置。 

我们对这些起始位置进行排序。 然后我们在这个排序列表上扫描大小为 k 的窗口。 对于每个窗口，我们计算从第一次出现开始到最后一次出现结束的子字符串跨度。 最好的答案是所有窗口的最小跨度。 

最后，我们输出这个最小长度，如果出现次数少于 k，则输出 -1。 

### 为什么它有效

 任何包含 k 次出现的模式的子串都会在其中产生 k 次出现起始位置，并且这些位置必须按升序出现。 覆盖 k 个出现的最紧子串始终由按排序顺序的 k 个出现的某个连续块定义，因为跳过出现只会增加跨度。 自动机保证我们正确枚举所有出现的情况，滑动窗口保证我们测试所有最佳连续组而不会丢失任何配置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SAM:
    def __init__(self, n):
        self.next = [dict()]
        self.link = [-1]
        self.length = [0]
        self.pos = [[]]
        self.last = 0

    def extend(self, c, idx):
        cur = len(self.next)
        self.next.append({})
        self.length.append(self.length[self.last] + 1)
        self.link.append(0)
        self.pos.append([idx])

        p = self.last
        while p != -1 and c not in self.next[p]:
            self.next[p][c] = cur
            p = self.link[p]

        if p == -1:
            self.link[cur] = 0
        else:
            q = self.next[p][c]
            if self.length[p] + 1 == self.length[q]:
                self.link[cur] = q
            else:
                clone = len(self.next)
                self.next.append(self.next[q].copy())
                self.length.append(self.length[p] + 1)
                self.link.append(self.link[q])
                self.pos.append([])

                while p != -1 and self.next[p].get(c) == q:
                    self.next[p][c] = clone
                    p = self.link[p]

                self.link[q] = self.link[cur] = clone

        self.last = cur

    def build(self, s):
        for i, ch in enumerate(s):
            self.extend(ch, i)

    def propagate(self):
        order = sorted(range(len(self.next)), key=lambda x: self.length[x], reverse=True)
        for v in order:
            if self.link[v] != -1:
                self.pos[self.link[v]].extend(self.pos[v])

    def match(self, t):
        v = 0
        for ch in t:
            if ch not in self.next[v]:
                return None
            v = self.next[v][ch]
        return v

s = input().strip()
sam = SAM(len(s))
sam.build(s)
sam.propagate()

q = int(input())
for _ in range(q):
    k, m = input().split()
    k = int(k)

    v = sam.match(m)
    if v is None:
        print(-1)
        continue

    occ = sam.pos[v]
    if len(occ) < k:
        print(-1)
        continue

    starts = [p - len(m) + 1 for p in occ]
    starts.sort()

    ans = 10**18
    for i in range(len(starts) - k + 1):
        l = starts[i]
        r = starts[i + k - 1] + len(m) - 1
        ans = min(ans, r - l + 1)

    print(ans)
```后缀自动机是在字符串上增量构建的，每次创建时，每个状态都会记录一个结束位置。 构造之后，出现列表沿着后缀链接传播，以便每个状态累积它所表示的子串的所有终止位置。 match 函数遍历转换来定位与模式对应的状态。 

一个微妙的实现细节是传播必须以长度递减的顺序发生，否则后缀链路聚合会失去正确性，因为较短的状态依赖于较长的状态。 另一个重要的细节是仔细地将结束位置转换为开始位置`p - len(m) + 1`，因为 SAM 存储结束索引。 

最终的窗口计算假设出现的事件已排序； 由于 SAM 传播不保证顺序，因此需要显式排序。 

## 工作示例

 考虑示例字符串`aaaaa`和查询模式`aaa`其中 k = 2。 

传播后，出现结束位置为`[2, 3, 4]`。 

| 窗口| 事件（完）| 开始职位| 跨度|
 | ---| ---| ---| ---|
 | [2,3]| 2,3 | 0,1 | 3 |
 | [3,4]| 3、| | |
