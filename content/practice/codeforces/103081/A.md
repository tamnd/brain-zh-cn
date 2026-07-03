---
title: "CF 103081A - 感恩"
description: "我们收到了本每日感谢信的按时间顺序排列的日志。 每天恰好贡献三个独立的文本条目，因此在所有日子里我们总共有一个 3N 个字符串的序列。 每个字符串代表本写下的一个“事物”。"
date: "2026-07-03T23:16:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103081
codeforces_index: "A"
codeforces_contest_name: "2020-2021 ICPC Southwestern European Regional Contest (SWERC 2020)"
rating: 0
weight: 103081
solve_time_s: 49
verified: true
draft: false
---

[CF 103081A - 感恩](https://codeforces.com/problemset/problem/103081/A)

 **评级：** -
 **标签：** -
 **求解时间：** 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们收到了本每日感谢信的按时间顺序排列的日志。 每天恰好贡献三个独立的文本条目，因此在所有日子里我们总共有一个 3N 个字符串的序列。 每个字符串代表本写下的一个“事物”。 

任务是通过识别 K 个最常出现的字符串来总结这个集合。 仅频率不足以完全确定排序。 当两个不同的字符串出现相同次数时，最后一次出现在输入中较晚的字符串必须排在第一位。 

输出是不同字符串的排名列表，主要按频率递减排序，其次按最后出现索引递减排序，我们只打印其中的前 K 个。 

输入大小最多可达 100,000 行文本。 任何按字符串重复排序或扫描整个数据集的解决方案都会太慢。 自然约束表明我们的目标应该接近 O(N log N) 或 O(N)，因为字符串上的 O(N^2) 是不可能的。 

一个微妙的问题是排序不仅取决于计数，还取决于最后出现的位置。 这意味着我们必须在一次传递期间跟踪两个聚合。 单纯的频率图是不够的，除非它还存储位置信息。 

一些边缘情况很重要：

 如果所有字符串都是唯一的，则每个频率都是 1，因此排序完全取决于最后一次出现，这实际上成为唯一元素的反向输入顺序。 

如果所有字符串都相同，则无论 K 是多少，都只有一根输出线。 

如果 K 超过不同字符串的数量，我们将输出所有不同字符串。 

一个幼稚的错误是仅按频率排序而忽略平局规则。 例如，如果“A”和“B”都出现两次，但“A”最后一次出现早于“B”，则即使它们的计数相等，“B”也必须先出现。 

## 方法

 暴力破解的想法很简单：首先收集所有 3N 个字符串，然后对于每个不同的字符串，再次扫描整个列表以计算出现次数并跟踪其最后位置。 之后，使用这些计算值对所有不同的字符串进行排序。 

这是正确的，但非常昂贵。 如果有 U 个不同的字符串，每个字符串都需要 O(N) 扫描，则仅预处理成本就为 O(UN)。 在最坏的情况下，U 是 θ(N)，给出 O(N²)，这对于 N 高达 100,000 来说远远不可行。 

关键的观察是所需的统计数据、频率和最后出现索引都可以在单个线性扫描中计算。 我们不重新计算每个字符串的计数，而是维护一个从字符串到一对的哈希映射：它的计数和它出现的最后一个索引。 每次更新平均为 O(1)，因此完整的预处理为 O(N)。 

一旦我们有了这个映射，我们就把它转换成一个列表，并使用所需的排序键对其进行一次排序：首先是频率较高的，然后是最后一个索引较高的。 这将问题简化为针对 U 项的标准排序任务。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | ---| --- |
 | 蛮力 | O(N²) | O(N) | 太慢了|
 | 最佳 | O(N log N) | O(N log N) | O(N) | 已接受 |

 ## 算法演练

 ### 步骤

1. 按顺序读取所有 3N 个字符串，保持运行索引 i 从 0 到 3N−1。 该索引至关重要，因为平局决胜取决于最后出现的位置。 
2. 维护一个以字符串为键的字典。 对于位置 i 处的每个字符串 s，通过增加其频率并将其最后位置设置为 i 来更新其条目。 覆盖最后一个位置是正确的，因为我们总是想要最近发生的位置。 
3. 处理完所有行后，将字典转换为 (Frequency, Last_position, string) 形式的元组列表。 这种格式使排序变得简单。 
4. 使用自定义顺序对此列表进行排序：频率较高的优先，对于相同频率，优先的last_position 较高。 字符串本身仅用于输出。 
5. 输出排序列表中的前 K 个字符串。 

### 为什么它有效

 该算法保持一个不变量，即处理完第 i 行后，字典中的每个字符串都准确存储其在前缀 [0, i] 中的总频率以及该前缀中最近出现的索引。 由于每次更新都是本地的并且仅覆盖最后的位置，因此不会丢失可能影响正确性的历史信息。 在最终迭代之后，这些值对于整个序列来说是准确的，因此对它们进行全局排序会产生所需的排名。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())
    
    freq = {}
    last = {}
    
    for i in range(3 * n):
        s = input().rstrip('\n')
        if s in freq:
            freq[s] += 1
        else:
            freq[s] = 0
            freq[s] = 1
        last[s] = i
    
    items = []
    for s in freq:
        items.append((freq[s], last[s], s))
    
    items.sort(key=lambda x: (-x[0], -x[1]))
    
    out = []
    for i in range(min(k, len(items))):
        out.append(items[i][2])
    
    print("\n".join(out))

if __name__ == "__main__":
    solve()
```该解决方案使用两个字典，一个用于频率，另一个用于最后出现索引。 它们可以合并为一个结构，但将它们分开可以使逻辑明确：一个跟踪数量，另一个跟踪新近度。 

排序键直接编码问题的排序规则。 对频率和最后一个索引取反会将默认的升序排序转换为所需的降序排序。 

一个微妙的点是我们将最后一个索引存储为原始输入行上的循环计数器 i 。 即使天被分成三组，这也确保了正确的时间顺序比较。 

## 工作示例

 ### 示例 1

 输入：```
2 2
A
B
C
D
C
E
```我们处理 6 个条目。 

| 我| 字符串| 频率状态| 最后状态 |
 | --- | --- | --- | --- |
 | 0 | 一个 | 答：1 | 答：0 |
 | 1 | 乙| 乙：1 | 乙：1 |
 | 2 | C | C：1 | C：2 |
 | 3 | d | 深度：1 | 深度：3 |
 | 4 | C | C：2 | C：4 |
 | 5 | 电子| E：1 | E：5 |

 排序前的最终项目：

 A(1,0)、B(1,1)、C(2,4)、D(1,3)、E(1,5)

 排序：

 C(2,4)、E(1,5)、D(1,3)、B(1,1)、A(1,0)

 取 K=2 得出：

 C

 乙

 这表明频率占主导地位，而联系则通过最后出现索引来解决。 

### 示例 2

 输入：```
1 5
X
Y
Z
```所有频率均为 1，最后位置为 X:0、Y:1、Z:2。 

排序顺序变为 Z、Y、X。 

由于 K=5，但仅存在 3 个不同的项，因此我们输出所有项。 

这证实了 K 充当上限而不是强制填充。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N log N) | O(N log N) | 单遍在 O(N) 中构建哈希图，排序 U ≤ 3N 项的成本为 O(N log N) |
 | 空间| O(N) | 存储每个不同字符串的频率和最后位置 |

 100,000 行的输入限制使这种方法非常安全。 散列步骤是线性的，排序占主导地位，但仍处于 Python 的典型约束范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdout.getvalue() if False else solve_capture(inp)

def solve_capture(inp: str) -> str:
    import sys
    from io import StringIO
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout
    sys.stdin = StringIO(inp)
    sys.stdout = StringIO()
    
    def solve():
        n, k = map(int, input().split())
        freq = {}
        last = {}
        for i in range(3 * n):
            s = input().rstrip('\n')
            if s in freq:
                freq[s] += 1
            else:
                freq[s] = 1
            last[s] = i
        
        items = [(freq[s], last[s], s) for s in freq]
        items.sort(key=lambda x: (-x[0], -x[1]))
        k2 = min(k, len(items))
        print("\n".join(items[i][2] for i in range(k2)))
    
    solve()
    out = sys.stdout.getvalue()
    sys.stdin = backup_stdin
    sys.stdout = backup_stdout
    return out.strip()

# provided samples
assert solve_capture("""2 2
A
B
C
D
C
E
""") == "C\nE"

# all equal
assert solve_capture("""3 2
A
A
A
A
A
A
A
A
A
""") == "A"

# all distinct
assert solve_capture("""1 3
A
B
C
""") == "C\nB\nA"

# tie by last occurrence
assert solve_capture("""1 3
A
B
A
""") == "A\nB"

# K exceeds distinct
assert solve_capture("""1 10
X
Y
Z
""") == "Z\nY\nX"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 所有相等的字符串 | 单行| 重复项的崩溃|
 | 全部不同| 逆序| 按新近程度打破平局 |
 | 重复打领带| A 在 B 之前 | 最后出现规则 |
 | K > 不同 | 完整列表 | 截断行为|

 ## 边缘情况

 一个常见的失败案例是忽略最后出现规则。 考虑：```
1 2
A
B
A
```这里 A 和 B 都出现一次，但 A 必须出现在 B 之前，因为它最后一次出现在索引 2 处，而 B 位于索引 1 处。算法在扫描期间正确更新最后位置，因此 A 获得更高的优先级。 

另一个边缘情况是当 K 超过唯一字符串的数量时。 排序步骤仅产生不同的项目，因此使用 min(k, len(items)) 进行切片可以防止输出超出范围。
