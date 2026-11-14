---
title: "CF 44E - 猴子安菲萨"
description: "我们得到一串不包含空格的小写字母。 任务是将这个字符串分割成恰好 k 个连续的部分。 每块的长度必须在 a 和 b 之间（含）。 字符的顺序不能改变。 我们只是决定在哪里切断绳子。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 44
codeforces_index: "E"
codeforces_contest_name: "School Team Contest 2 (Winter Computer School 2010/11)"
rating: 1400
weight: 44
solve_time_s: 133
verified: false
draft: false
---

[CF 44E - 猴子安菲萨](https://codeforces.com/problemset/problem/44/E)

 **评分：** 1400
 **标签：** dp
 **求解时间：** 2m 13s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一串不包含空格的小写字母。 任务是将这个字符串准确地分割成`k`连续的片断。 每块的长度必须介于`a`和`b`，包含在内。 

字符的顺序不能改变。 我们只是决定在哪里切断绳子。 

假设输入是：```
k = 3
a = 2
b = 5
s = "abrakadabra"
```一种有效的分割是：```
ab
rakad
abra
```因为长度是`2`,`5`， 和`4`，都在允许的范围之内。 

限制很小。 字符串长度最多为`200`， 和`k`,`a`， 和`b`也至多`200`。 这立即告诉我们，即使是二次或三次动态规划解决方案也是完全安全的。 对所有可能的分区进行强力搜索仍然是危险的，因为放置剪切的方法数量呈指数级增长。 例如，即使是一个长度为`200`有大量可能的细分。 

关键的观察是我们只关心字符串的前缀是否可以分割成一定数量的有效部分。 这种结构自然会导致动态规划。 

有几种边缘情况可能会默默地破坏不正确的实现。 

一个常见的错误是忘记必须使用整个字符串。 考虑：```
2 2 3
abcde
```字符串长度为`5`。 存在有效的分割：```
ab
cde
```粗心的贪婪方法可能会占用尽可能大的第一段`"abc"`然后失败，因为`"de"`有长度`2`，实际上在这里仍然有效，但是如果余数变得太短，类似的输入可能会失败。 

另一个棘手的情况是当不存在解决方案时，因为总长度无法分配。```
3 2 2
abcde
```我们正好需要三段长度`2`，所以所需的总长度是`6`，但字符串长度是`5`。 正确的输出是：```
No solution
```仅检查本地段长度而不验证全局总数的实现可能会错误地打印部分结果。 

当出现第三种微妙的情况时`a = b`。 那么每个段的长度都是固定的。```
2 3 3
abcdef
```唯一有效的答案是：```
abc
def
```这更像是精确分区而不是灵活分割。 

## 方法

 蛮力方法会尝试一切可能的方法来放置`k - 1`切断绳子内部。 对于每个分区，我们检查所有段长度是否位于`a`和`b`。 

这是有效的，因为每个有效答案都对应于某些剪切位置。 问题在于可能性的数量。 一个长度的字符串`n`有`n - 1`可能的切割位置，我们正在选择`k - 1`其中。 分区的数量变为组合：$$\binom{n-1}{k-1}$$和`n = 200`，这是完全不可行的。 

重要的结构观察是分割的有效性仅取决于前缀。 如果我们已经知道第一个是否`i`字符可以分为`j`有效的段，那么我们可以尝试用另一个段来扩展该状态。 

这自然就形成了动态编程的过渡。 

定义：$$dp[i][j]$$就如是否是第一个`i`字符可以被精确地分割成`j`有效部分。 

来自一个州`(i, j)`，我们尝试取下一个段的长度`len`之间`a`和`b`。 如果`i + len`不超过字符串长度，则：$$dp[i + len][j + 1] = True$$这将问题从指数搜索简化为小多项式时间 DP。 由于所有限制最多为`200`，即使是简单的实现也足够快。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| O(k) | 太慢了 |
 | 最佳DP | O(n × k × (b - a + 1)) | O(n × k × (b - a + 1)) | O(n × k) | O(n × k) | 已接受 |

 ## 算法演练

 1. 读取数值`k`,`a`,`b`和字符串`s`。 
2.让`n`是字符串的长度。 
3. 创建一个DP表，其中`dp[i][j]`告诉我们是否第一个`i`字符可以被精确地分割成`j`有效段。 
4. 初始化`dp[0][0] = True`。 

这意味着空前缀可以分为零部分。 
5. 对于每个位置`i`从`0`到`n`：

 对于每个段计数`j`从`0`到`k - 1`：

如果`dp[i][j]`是真的，尝试每个段的长度`len`从`a`到`b`。 
6.如果`i + len <= n`，那么我们可以将当前分区扩展一个有效段。 

标记：$$dp[i + len][j + 1] = True$$7. 要重建答案，请在转换成功时存储先前的状态。 

例如，保存：```
parent[next_i][next_j] = (i, j)
```8. 填写表格后，检查`dp[n][k]`。 

如果为假，则打印`"No solution"`。 
9. 否则，使用父指针回溯。 

开始于`(n, k)`，重复恢复之前的状态并提取相应的子串。 
10. 反转收集的片段，因为重建是向后发生的。 
11. 逐行打印段。 

### 为什么它有效

 DP 不变量为：`dp[i][j]`当且仅当第一个为真`i`字符可以精确地划分为`j`有效段。 

基本情况是正确的，因为空字符串需要零个段。 

每个转换都保持正确性，因为我们只附加长度在`a`和`b`。 每个可达状态对应于前缀的有效分区。 

重建是有效的，因为每个存储的父指针都记录了用于构建 DP 状态的实际转换。 

由于从每个可达状态探索每个可能的有效段长度，因此不会错过任何有效的解决方案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    k, a, b = map(int, input().split())
    s = input().strip()

    n = len(s)

    dp = [[False] * (k + 1) for _ in range(n + 1)]
    parent = [[None] * (k + 1) for _ in range(n + 1)]

    dp[0][0] = True

    for i in range(n + 1):
        for j in range(k):
            if not dp[i][j]:
                continue

            for length in range(a, b + 1):
                ni = i + length

                if ni > n:
                    continue

                if not dp[ni][j + 1]:
                    dp[ni][j + 1] = True
                    parent[ni][j + 1] = (i, j)

    if not dp[n][k]:
        print("No solution")
        return

    parts = []

    cur_i = n
    cur_j = k

    while cur_j > 0:
        prev_i, prev_j = parent[cur_i][cur_j]

        parts.append(s[prev_i:cur_i])

        cur_i = prev_i
        cur_j = prev_j

    parts.reverse()

    print("\n".join(parts))

solve()
```该解决方案首先创建一个布尔 DP 表。 尺寸为`(n + 1) × (k + 1)`因为我们跟踪每个可能的前缀长度和每个可能的构造段数。 

嵌套循环迭代所有可达状态。 每当`dp[i][j]`是真的，我们尝试附加另一个长度介于`a`和`b`。 

该行：```
ni = i + length
```在获取下一个段后计算新的前缀大小。 

条件：```
if ni > n:
```防止访问超出字符串末尾的字符。 此边界检查至关重要，因为否则最后的段可能会溢出字符串。 

父表仅在状态第一次变得可达时存储重建信息。 任何有效的重建都是可以接受的，因此我们不需要覆盖早期的父母。 

在重建过程中，子串：```
s[prev_i:cur_i]
```正是从过渡期间添加的段`(prev_i, prev_j)`到`(cur_i, cur_j)`。 

收集的段以相反的顺序显示，因为回溯从完整字符串开始，向后走向空前缀。 颠倒列表即可恢复正确的顺序。 

## 工作示例

 ### 示例 1

 输入：```
3 2 5
abrakadabra
```字符串长度为`11`。 

| 当前我| 当前 j | 尝试长度| 下一个状态 | 有效|
 | --- | --- | --- | --- | --- |
 | 0 | 0 | 2 | (2,1) | 是的 |
 | 0 | 0 | 3 | (3,1) | 是的 |
 | 0 | 0 | 4 | (4,1) | 是的 |
 | 0 | 0 | 5 | (5,1) | 是的 |
 | 2 | 1 | 5 | (7,2) | 是的 |
 | 7 | 2 | 4 | (11,3)| 是的 |

 一种重建路径是：```
(0,0) -> (2,1) -> (7,2) -> (11,3)
```得到的片段是：```
ab
rakad
abra
```该跟踪演示了 DP 如何探索多个可能的段长度，同时保留每个可达状态对应于有效分区的不变性。 

### 示例 2

 输入：```
3 2 2
abcde
```字符串长度为`5`。 

| 当前我| 当前 j | 尝试长度| 下一个状态 | 有效|
 | --- | --- | --- | --- | --- |
 | 0 | 0 | 2 | (2,1) | 是的 |
 | 2 | 1 | 2 | (4,2) | 是的 |
 | 4 | 2 | 2 | (6,3) | 没有 |

 DP 永远达不到`(5,3)`。 

正确的输出是：```
No solution
```这个例子说明了为什么局部有效性还不够。 尽管允许每个单独的段长度，但总长度无法正确分配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n × k × (b - a + 1)) | O(n × k × (b - a + 1)) | 每个 DP 状态都会尝试所有段长度 |
 | 空间| O(n × k) | O(n × k) | DP表和父表|

 因为所有的值最多都是`200`，最大转换次数大致为：$$200 \times 200 \times 200 = 8 \times 10^6$$这很容易满足 Python 的时间限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    k, a, b = map(int, input().split())
    s = input().strip()

    n = len(s)

    dp = [[False] * (k + 1) for _ in range(n + 1)]
    parent = [[None] * (k + 1) for _ in range(n + 1)]

    dp[0][0] = True

    for i in range(n + 1):
        for j in range(k):
            if not dp[i][j]:
                continue

            for length in range(a, b + 1):
                ni = i + length

                if ni > n:
                    continue

                if not dp[ni][j + 1]:
                    dp[ni][j + 1] = True
                    parent[ni][j + 1] = (i, j)

    if not dp[n][k]:
        print("No solution")
        return

    ans = []

    cur_i = n
    cur_j = k

    while cur_j > 0:
        prev_i, prev_j = parent[cur_i][cur_j]
        ans.append(s[prev_i:cur_i])

        cur_i = prev_i
        cur_j = prev_j

    ans.reverse()

    print("\n".join(ans))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    backup = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = backup

    return out.getvalue().strip()

# provided sample
assert run("3 2 5\nabrakadabra\n") == "ab\nrakad\nabra", "sample 1"

# minimum size
assert run("1 1 1\na\n") == "a", "single character"

# impossible partition
assert run("3 2 2\nabcde\n") == "No solution", "impossible total length"

# exact fixed lengths
assert run("2 3 3\nabcdef\n") == "abc\ndef", "fixed partition sizes"

# boundary condition
assert run("2 1 4\nabcde\n") == "a\nbcde", "uses smallest and largest lengths"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1 / a`|`a`| 尽可能最小的输入 |
 |`3 2 2 / abcde`|`No solution`| 不可能的总长度|
 |`2 3 3 / abcdef`|`abc / def`| 精确的固定大小段 |
 |`2 1 4 / abcde`|`a / bcde`| 边界长度`a`和`b`|

 ## 边缘情况

 考虑不可能的总长度情况：```
3 2 2
abcde
```每个段的长度必须精确`2`，所以三个段需要长度`6`。 民主党到达各州`(2,1)`和`(4,2)`，但不能进一步扩展，因为添加另一个段将超出字符串长度。 自从`dp[5][3]`仍然为假，算法正确打印：```
No solution
```现在考虑固定长度的场景：```
2 3 3
abcdef
```唯一允许的段大小是`3`。 转换变得确定性：```
(0,0) -> (3,1) -> (6,2)
```重建后的答案是：```
abc
def
```该算法自然地处理这一问题，因为段长度上的内部循环仅包含一个值。 

最后，考虑贪婪选择可能失败的情况：```
2 2 4
abcdefg
```如果我们贪心地取最大的第一段`"abcd"`长度`4`, 余数`"efg"`有长度`3`，仍然有效。 但对于类似的输入，贪婪的决策可能会让我们陷入困境。 

DP 完全避免了这个问题，因为它探索每个可达状态的每个有效段长度。 如果存在任何有效分区，则某些 DP 路径将到达`(n,k)`。
