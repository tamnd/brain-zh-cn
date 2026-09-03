---
title: "CF 104974E - 实习花艺师"
description: "我们正在模拟一个非常小的文件系统，它支持顺序应用的三个操作。 每个操作要么创建一个命名文件，要么删除一个命名文件，要么询问当前存在多少个文件。"
date: "2026-06-28T06:10:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104974
codeforces_index: "E"
codeforces_contest_name: "Codentines Day"
rating: 0
weight: 104974
solve_time_s: 49
verified: true
draft: false
---

[CF 104974E - 实习花店](https://codeforces.com/problemset/problem/104974/E)

 **评级：** -
 **标签：** -
 **求解时间：** 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在模拟一个非常小的文件系统，它支持顺序应用的三个操作。 每个操作要么创建一个命名文件，要么删除一个命名文件，要么询问当前存在多少个文件。 文件由其名称唯一标识，并且名称的行为类似于精确的字符串，因此`"abc"`和`"ABC"`是不同的，空格是名称的一部分。 

该状态开始为空。 当一个`touch name`命令出现后，我们尝试将该名称插入到当前的文件集中。 如果它已经存在，则不会发生任何变化。 当`rm name`命令出现，我们删除该名称（如果存在）； 如果它不存在，我们又什么都不做。 当`ask`命令出现后，我们输出当前存储的文件数量。 

关键的困难在于规模。 命令数量最多可达100万个，文件名是任意字符串，总长度可达200​​万个字符。 这立即排除了任何扫描每个查询的所有存储名称的解决方案，因为即使是每个查询的线性扫描`ask`在最坏的情况下会退化为二次行为。 

一个幼稚的实现将维护一个字符串列表，并且`ask`，通过扫描整个列表并手动检查成员资格来重新计算存在多少个不同的字符串。 当有很多操作和很多存储文件时，这种情况就会崩溃。 

更微妙的故障模式来自于重复处理不当。 例如，如果我们对待`touch`作为“附加到列表”而不检查是否存在，重复触摸同名会错误地增加计数。 类似地，如果我们简单地减少每个计数器`rm`，如果删除目标不存在的文件，我们可以取负值。 

## 方法

 暴力破解的想法很简单：维护当前活动的所有文件名的列表。 为了`touch`，我们检查该名称是否已在列表中； 如果没有，我们将其附加。 为了`rm`，我们搜索列表，如果找到，我们将其删除。 为了`ask`，我们计算列表的大小。 

正确性是立竿见影的，因为该列表准确地反映了活动集。 问题是性能。 两个都`touch`存在检查和`rm`查找需要扫描最多 O(n) 字符串，删除也可能需要移位元素。 最多 10^6 次操作，在最坏的情况下会导致大约 O(n^2) 的行为，这远远超出了限制。 

关键的观察是我们只需要成员资格和基数，而不是顺序或结构。 这正是基于哈希的集合的设计目的。 如果我们将文件名存储在Python中`set`，所有三个操作的平均复杂度为 O(1)：插入、删除和成员资格检查平均时间为常数，并且集合的大小为我们提供了答案`ask`直接地。 

我们还完全避免重新计算。 该集合始终代表当前状态，因此计数只是读取结构内部维护的存储整数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力列表扫描| O(N²) | O(N) | 太慢了|
 | 哈希集 | 总共 O(N) | O(N) | 已接受 |

 ## 算法演练

 我们一个接一个地处理命令，同时维护一组活动文件名。 

1.初始化一个空集`files`。 这代表任何时间点所有当前存在的文件名。 
2. 阅读每个命令行并将其分成几部分。 第一个标记确定操作类型。 
3.如果命令是`touch name`， 插入`name`进入集合。 如果已经存在，则该集合保持不变，这符合忽略重复项的要求。 
4.如果命令是`rm name`， 消除`name`来自集合（如果存在）。 如果它不存在，则不执行任何操作。 这可以安全地使用`discard`所以不会出现错误。 
5. 如果命令是`ask`，输出集合的当前大小。 

该逻辑之所以有效，是因为每个文件名在集合中最多表示一次，并且通过添加或删除该元素来捕获每个有效的状态转换。 

### 为什么它有效

 每一步都设定`files`准确包含已插入的名称`touch`但未被删除`rm`。 这是归纳保留的：`touch`添加缺失的元素而不重复，`rm`仅删除现有元素而不影响其他元素，并且`ask`不修改状态。 因此，该集合的大小始终等于当时活动文件的数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n = int(input())
    files = set()
    out = []

    for _ in range(n):
        parts = input().strip().split()
        if parts[0] == "touch":
            files.add(parts[1])
        elif parts[0] == "rm":
            files.discard(parts[1])
        else:
            out.append(str(len(files)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```该解决方案依赖于Python的内置哈希集来存储文件名。 使用`discard`而不是`remove`是故意的，因为它避免了删除不存在的文件时出现异常，与问题陈述的“不执行任何操作”行为相匹配。 

我们将答案累积在列表中而不是立即打印，以减少 I/O 开销，这在查询上限时变得很重要。 

## 工作示例

 考虑示例输入：```
7
touch love_is_in_the_air
ask
touch Valentine
rm love_is_in_the_air
ask
rm Danny_is_cool
ask
```我们一步步跟踪该集。 

| 步骤| 命令| 设置状态 | 输出|
 | ---| ---| ---| ---|
 | 1 | 触摸空气中的爱 | {爱在空气中} | |
 | 2 | 问 | {爱在空气中} | 1 |
 | 3 | 触摸情人节| {爱情在空气中，情人节} | |
 | 4 | rm 空中之爱 | {情人节} | |
 | 5 | 问 | {情人节} | 1 |
 | 6 | rm Danny_is_cool | rm Danny_is_cool | {情人节} | |
 | 7 | 问 | {情人节} | 1 |

 此跟踪显示重复安全插入和无操作删除均已正确处理，并且`ask`只需读取当前状态而无需重新计算。 

现在考虑重复操作的第二种场景：```
6
touch a
touch a
touch b
rm c
ask
rm a
ask
```| 步骤| 命令| 设置状态 | 输出|
 | ---| ---| ---| ---|
 | 1 | 触摸 | {一} | |
 | 2 | 触摸 | {一} | |
 | 3 | 触摸b | {a，b} | |
 | 4 | rm c | {a，b} | |
 | 5 | 问 | {a，b} | 2 |
 | 6 | rm a | {b} | |
 | 7 | 问 | {b} | 1 |

 这证实了重复`touch`不会增加计数，并且删除不存在的名称会被安全地忽略。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N) 平均 | 每个操作都是一次哈希集更新或查找，其摊销常数时间 |
 | 空间| O(M)| M 是同时存储的不同文件名的数量 |

 这些约束允许最多一百万次操作，因此具有恒定时间更新的线性时间处理完全在限制范围内。 内存使用量受活动文件名数量的限制，该数量最多是不同文件名的数量`touch`运营。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque

    n = int(sys.stdin.readline())
    files = set()
    out = []

    for _ in range(n):
        parts = sys.stdin.readline().strip().split()
        if parts[0] == "touch":
            files.add(parts[1])
        elif parts[0] == "rm":
            files.discard(parts[1])
        else:
            out.append(str(len(files)))

    return "\n".join(out)

# provided sample
assert run("""7
touch love_is_in_the_air
ask
touch Valentine
rm love_is_in_the_air
ask
rm Danny_is_cool
ask
""") == "1\n1\n1"

# empty-ish behavior
assert run("""3
ask
touch a
ask
""") == "0\n1"

# duplicate touches
assert run("""5
touch x
touch x
ask
rm x
ask
""") == "1\n0"

# remove non-existent
assert run("""4
rm a
touch b
ask
ask
""") == "1\n1"

# larger mixed
assert run("""8
touch a
touch b
touch c
rm b
ask
rm a
ask
rm c
ask
""") == "2\n1\n0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品| 1 1 1 | 1 1 1 基本正确性|
 | 空的| 0 1 | 初始状态处理|
 | 重复触摸| 1 0 | 1 0 幂等插入 |
 | 删除不存在的| 1 1 | 1 安全删除|
 | 较大混合| 2 1 0 | 2 1 0 顺序一致性|

 ## 边缘情况

 重复一种边缘情况`touch`具有相同的文件名。 由于集合忽略重复项，因此状态保持稳定。 例如：

 输入：```
touch a
touch a
ask
```该集合变为`{a}`两个操作之后，所以输出是`1`。 除非明确检查，否则基于列表的实现将错误地存储两个副本。 

另一个边缘情况是删除从未创建的文件。 使用`discard`确保没有异常并且没有状态改变：

 输入：```
rm missing
ask
```该集合保持为空，输出为`0`。 一个天真的`remove`调用会崩溃，而手动计数器方法可能会出现负值。 

最后一个边缘情况是大规模流失，其中文件不断添加和删除。 由于每个操作都是 O(1) 摊销，因此即使状态剧烈振荡，该算法也能保持线性性能。
