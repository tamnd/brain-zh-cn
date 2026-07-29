---
title: "CF 102800B - 问题选择"
description: "任务是为竞赛选择问题。 每个问题都由一个 URL 标识，但有用的信息隐藏在 URL 内：末尾的整数问题 ID。"
date: "2026-07-28T22:52:34+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102800
codeforces_index: "B"
codeforces_contest_name: "The 14th Jilin Provincial Collegiate Programming Contest"
rating: 0
weight: 102800
solve_time_s: 56
verified: true
draft: false
---

[CF 102800B - 问题选择](https://codeforces.com/problemset/problem/102800/B)

 **评级：** -
 **标签：** -
 **求解时间：** 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 任务是为竞赛选择问题。 每个问题都由一个 URL 标识，但有用的信息隐藏在 URL 内：末尾的整数问题 ID。 对于每个测试用例，我们都会收到一组唯一的问题 URL，并且必须提取它们的 ID，对它们进行排序，并打印最小的`k`ID 按升序排列。 

测试用例中的 URL 数量最多为 1000 个。这个数量足够小，即使是简单的排序方法也足够快。 一个典型的`O(n log n)`sort 仅执行大约几千次比较`n = 1000`，因此不需要更复杂的数据结构。 ID 范围也限制为 1 到 10000，这意味着甚至基于计数的方法也是可能的，但它们是不必要的。 

输入大小仍然需要仔细解析，因为 URL 是字符串而不是数字。 一个常见的错误是假设 ID 始终具有固定的位数。 例如，以以下结尾的 URL`501`以及以以下结尾的 URL`1001`两者都有效，因此解决方案必须提取最后一个斜杠之后的所有内容。 

另一个边缘情况是当`k`等于`n`。 在这种情况下，答案是对整个 ID 集进行排序。 仅部分处理数据的解决方案可能会意外省略值。 

例如，考虑：```
1
3 3
http://acm.hit.edu.cn/problemset/9
http://acm.hit.edu.cn/problemset/2
http://acm.hit.edu.cn/problemset/7
```正确的输出是：```
2 7 9
```一个粗心的实现假设`k`总是小于`n`可能无法输出所有值。 

另一种情况是当一个 ID 包含的数字少于其他 ID 时：```
1
4 2
http://acm.hit.edu.cn/problemset/501
http://acm.hit.edu.cn/problemset/50
http://acm.hit.edu.cn/problemset/500
http://acm.hit.edu.cn/problemset/1000
```正确的输出是：```
50 500
```直接对 URL 字符串进行排序会产生错误的顺序，因为字符串比较与整数比较不匹配。 该解决方案必须在排序之前将提取的文本转换为整数。 

## 方法

 一种简单的方法是读取每个 URL，提取 ID，将所有 ID 存储在数组中，对数组进行排序，然后取第一个`k`元素。 这是可行的，因为所需的答案仅取决于 ID 的数字顺序。 所有ID排序完毕后，取最小的`k`值恰好是第一个`k`职位。 

暴力替代方案会重复搜索最小的未使用 ID。 对于每个`k`如果需要答案，它会扫描所有剩余的 ID 以找到下一个最小值。 这是正确的，但在最坏的情况下，它的性能约为`n * k`比较。 自从`k`可以等于`n`，最坏情况达到`1000 * 1000 = 1,000,000`每个测试用例的比较。 对于这些约束来说，这仍然是可以接受的，但它忽略了问题的标准结构，并且对于较大版本来说成为一个坏习惯。 

更好的观察是，这个问题正是要求一组数字中的最小元素。 一旦 URL 被转换为 ID，就不再有任何特殊结构了。 排序在一次操作中给出完整的排序，并且第一个`k`元素就是想要的答案。 

蛮力方法之所以有效，是因为它直接模拟选择下一个最小元素，但它重复类似的搜索。 排序观察通过一次组织所有值来消除重复的工作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nk)，最坏情况 O(n²) | O(n) | 这里接受了，但是效率低下 |
 | 最佳| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例的数量。 对于每个测试用例，请阅读`n`和`k`，然后准备一个列表来存储提取的问题 ID。 获得数字 ID 后，就不再需要 URL 本身了。 
2. 处理每个`n`网址。 找到决赛后的部分`/`字符并将其转换为整数。 URL 的最后一个组成部分保证是问题 ID，因此此提取准确地给出了我们需要的值。 
3. 按数字升序对 ID 列表进行排序。 排序是关键操作，因为它将最小的 ID 放在列表的开头。 
4.输出第一个`k`排序列表中的值，以空格分隔。 由于列表已经排序，因此不需要进行额外的处理。 

为什么它有效：

 提取后，算法具有与原始问题完全相同的一组数字，仅表示为整数而不是字符串。 排序会保留每个值，同时将它们从小到大排列。 第一个`k`此排序中的位置必须包含`k`最小的 ID，因为每个剩余位置都包含至少与所选位置一样大的值。 因此，生成的输出始终是所需的问题 ID 集。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    ans = []

    for _ in range(t):
        n, k = map(int, input().split())
        ids = []

        for _ in range(n):
            url = input().strip()
            ids.append(int(url.rsplit('/', 1)[1]))

        ids.sort()
        ans.append(" ".join(map(str, ids[:k])))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```该解决方案首先读取测试用例的数量并独立处理每个用例。 名单`ids`仅存储整数，因为提取 ID 后 URL 格式就不再相关。 

表达式`url.rsplit('/', 1)[1]`仅在最后一个斜杠处分割字符串。 这可以避免依赖于 URL 前面部分的确切结构。 它可以正确处理不同数字长度的ID，例如`9`,`501`， 和`10000`。 

收集完所有ID后，`sort()`按数字排列它们。 Python 按值比较整数，这是问题所需的排序。 最后，用切片`ids[:k]`准确选择所需数量的最小 ID。 自从`k`可以等于`n`，这也可以正确处理必须打印整个排序列表的情况。 

输出累积在`ans`并在最后打印一次。 这避免了不必要的冲洗并保持输入和输出高效。 

## 工作示例

 ### 示例 1

 输入：```
1
3 2
http://acm.hit.edu.cn/problemset/1003
http://acm.hit.edu.cn/problemset/1002
http://acm.hit.edu.cn/problemset/1001
```追踪：

 | 步骤| 提取的 ID | 已排序 ID | 输出|
 | --- | --- | --- | --- |
 | 阅读第一个网址 | 1003 | 1003 | |
 | 阅读第二个网址 | 1003、1002 | | |
 | 阅读第三个网址 | 1003、1002、1001 | | |
 | 排序 | 1003、1002、1001 | 1001、1002、1003 | |
 | 取前 2 | | 1001、1002、1003 | 1001 1002 |

 跟踪显示原始 URL 顺序没有效果。 解析后只有提取的数字 ID 才重要。 

### 示例 2

 输入：```
1
4 1
http://acm.hit.edu.cn/problemset/1001
http://acm.hit.edu.cn/problemset/2001
http://acm.hit.edu.cn/problemset/3001
http://acm.hit.edu.cn/problemset/501
```追踪：

 | 步骤| 提取的 ID | 已排序 ID | 输出|
 | --- | --- | --- | --- |
 | 阅读网址 | 1001、2001、3001、501 | | |
 | 排序 | | 501、1001、2001、3001 | |
 | 先取 1 | | 501、1001、2001、3001 | 501 | 501

 此示例演示了为什么整数转换很重要。 如果将 ID 作为字符串进行比较，`1001`之前可能会错误地出现`501`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 提取 ID 需要 O(n)，排序在运行时占据主导地位 |
 | 空间| O(n) | 该列表存储一个测试用例的所有提取的 ID |

 最大`n`只有1000个，所以在时限内很容易排序。 内存占用也很小，因为只需要存储数字 ID。 

## 测试用例```python
import sys
import io

def solve(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output

    def main():
        input = sys.stdin.readline
        t = int(input())
        ans = []

        for _ in range(t):
            n, k = map(int, input().split())
            ids = []
            for _ in range(n):
                url = input().strip()
                ids.append(int(url.rsplit('/', 1)[1]))
            ids.sort()
            ans.append(" ".join(map(str, ids[:k])))

        print("\n".join(ans), end="")

    main()

    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return output.getvalue()

assert solve("""3
3 2
http://acm.hit.edu.cn/problemset/1003
http://acm.hit.edu.cn/problemset/1002
http://acm.hit.edu.cn/problemset/1001
4 1
http://acm.hit.edu.cn/problemset/1001
http://acm.hit.edu.cn/problemset/2001
http://acm.hit.edu.cn/problemset/3001
http://acm.hit.edu.cn/problemset/501
1 3
http://acm.hit.edu.cn/problemset/9
http://acm.hit.edu.cn/problemset/2
http://acm.hit.edu.cn/problemset/7
""") == """1001 1002
501
2 7 9""", "samples"

assert solve("""1
1 1
http://acm.hit.edu.cn/problemset/10000
""") == "10000", "minimum size case"

assert solve("""1
5 5
http://acm.hit.edu.cn/problemset/5
http://acm.hit.edu.cn/problemset/4
http://acm.hit.edu.cn/problemset/3
http://acm.hit.edu.cn/problemset/2
http://acm.hit.edu.cn/problemset/1
""") == "1 2 3 4 5", "k equals n"

assert solve("""1
4 2
http://acm.hit.edu.cn/problemset/50
http://acm.hit.edu.cn/problemset/500
http://acm.hit.edu.cn/problemset/501
http://acm.hit.edu.cn/problemset/1000
""") == "50 500", "different digit lengths"

assert solve("""1
6 3
http://acm.hit.edu.cn/problemset/8
http://acm.hit.edu.cn/problemset/8
http://acm.hit.edu.cn/problemset/8
http://acm.hit.edu.cn/problemset/8
http://acm.hit.edu.cn/problemset/8
http://acm.hit.edu.cn/problemset/8
""") == "8 8 8", "all equal values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 提供样品|`1001 1002`,`501`,`2 7 9`| 基本提取、排序和选择 |
 | 单一网址 |`10000`| 最小输入尺寸和大边界ID |
 |`k = n`|`1 2 3 4 5`| 打印完整的排序列表 |
 | 混合数字长度 |`50 500`| 整数排序而不是字符串排序 |
 | 所有相同的值 |`8 8 8`| 在通用实现中处理重复值 |

 ## 边缘情况

 当`k`等于 URL 的数量，该算法不需要特殊的分支。 对于输入：```
1
3 3
http://acm.hit.edu.cn/problemset/9
http://acm.hit.edu.cn/problemset/2
http://acm.hit.edu.cn/problemset/7
```提取的列表是`[9, 2, 7]`。 排序给出`[2, 7, 9]`，并用切片`[:3]`返回每个元素。 输出是：```
2 7 9
```假设请求值总是较少的解决方案可能会错误地提前停止。 

对于不同位数的 ID，算法会在排序之前将文本转换为整数。 和：```
1
4 2
http://acm.hit.edu.cn/problemset/501
http://acm.hit.edu.cn/problemset/50
http://acm.hit.edu.cn/problemset/500
http://acm.hit.edu.cn/problemset/1000
```提取的值是`[501, 50, 500, 1000]`。 按数字排序产生`[50, 500, 501, 1000]`，因此打印前两个值：```
50 500
```基于字符串的解决方案会比较字符，并且可能会以错误的顺序放置值。 

当所有 ID 相等时，排序操作仍然可以正确运行。 尽管最初的问题保证了 ID 的唯一性，但测试此案例可验证选择逻辑本身并不依赖于唯一性。 对于六个包含 ID 的 URL`8`和`k = 3`，排序后的值如下`[8, 8, 8, 8, 8, 8]`，答案是前三个值：```
8 8 8
```
